import { User } from '@supabase/supabase-js';

export interface UserPlanInfo {
  name: string;
  postsLimit: number;
  postsGenerated: number;
  freePostsUsed: number;
  startDate: Date;
  endDate: Date;
}

const PLAN_LIMITS = {
  free: 6,
  pro: Infinity,
  enterprise: Infinity
};

const FREE_MONTHLY_POSTS = 6;

class UserPlanService {
  private static instance: UserPlanService;
  private storageKey = 'user_plan_data';

  private constructor() {}

  static getInstance(): UserPlanService {
    if (!UserPlanService.instance) {
      UserPlanService.instance = new UserPlanService();
    }
    return UserPlanService.instance;
  }

  private getStorageKey(userId: string): string {
    return `${this.storageKey}_${userId}`;
  }

  updateUserPlan(userId: string, planName: 'free' | 'pro' | 'enterprise'): void {
    const currentPlan = this.getUserPlan({ id: userId } as User);
    if (!currentPlan) return;

    // When upgrading from free to paid plan, keep track of posts generated
    const postsGenerated = planName !== 'free' ? currentPlan.freePostsUsed : 0;

    const newPlan: UserPlanInfo = {
      name: planName,
      postsLimit: PLAN_LIMITS[planName],
      postsGenerated: postsGenerated, // Transfer free posts to plan posts when upgrading
      freePostsUsed: currentPlan.freePostsUsed || 0, // Preserve free posts usage
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    };

    this.savePlanData(userId, newPlan);
  }

  getUserPlan(user: User | null): UserPlanInfo | null {
    if (!user) return null;

    try {
      const storedData = localStorage.getItem(this.getStorageKey(user.id));
      let planData = null;

      if (storedData) {
        try {
          planData = JSON.parse(storedData);
          // Convert date strings to Date objects
          planData.startDate = new Date(planData.startDate);
          planData.endDate = new Date(planData.endDate);
        } catch (e) {
          console.error('Error parsing stored plan data:', e);
          planData = null;
        }
      }

      // If no valid stored data, or if stored data is invalid, create new free plan
      if (!planData || !planData.name || !PLAN_LIMITS[planData.name]) {
        const newPlan: UserPlanInfo = {
          name: 'free',
          postsLimit: PLAN_LIMITS.free,
          postsGenerated: 0,
          freePostsUsed: 0,
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        };
        this.savePlanData(user.id, newPlan);
        return newPlan;
      }

      // Check if the plan has expired
      const endDate = new Date(planData.endDate);
      if (endDate < new Date()) {
        // Reset the plan period but keep the same plan type
        const newPlan: UserPlanInfo = {
          ...planData,
          postsGenerated: 0, // Reset posts generated on renewal
          freePostsUsed: 0, // Reset free posts on renewal
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        };
        this.savePlanData(user.id, newPlan);
        return newPlan;
      }

      // Ensure all fields are properly set
      const validatedPlan: UserPlanInfo = {
        name: planData.name || 'free',
        postsLimit: PLAN_LIMITS[planData.name] || PLAN_LIMITS.free,
        postsGenerated: planData.postsGenerated || 0,
        freePostsUsed: planData.freePostsUsed || 0,
        startDate: new Date(planData.startDate),
        endDate: new Date(planData.endDate)
      };

      // Save the validated plan data
      this.savePlanData(user.id, validatedPlan);
      return validatedPlan;
    } catch (error) {
      console.error('Error in getUserPlan:', error);
      // Return a new free plan as fallback
      const fallbackPlan: UserPlanInfo = {
        name: 'free',
        postsLimit: PLAN_LIMITS.free,
        postsGenerated: 0,
        freePostsUsed: 0,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
      };
      this.savePlanData(user.id, fallbackPlan);
      return fallbackPlan;
    }
  }

  incrementPostCount(userId: string): boolean {
    const planData = this.getUserPlan({ id: userId } as User);
    if (!planData) return false;

    // For paid plans, first use up free posts if available
    if (planData.name !== 'free' && planData.freePostsUsed < FREE_MONTHLY_POSTS) {
      const updatedPlan = {
        ...planData,
        freePostsUsed: planData.freePostsUsed + 1
      };
      this.savePlanData(userId, updatedPlan);
      return true;
    }

    // For free plan users
    if (planData.name === 'free') {
      if (planData.freePostsUsed >= FREE_MONTHLY_POSTS) {
        return false;
      }
      const updatedPlan = {
        ...planData,
        freePostsUsed: planData.freePostsUsed + 1
      };
      this.savePlanData(userId, updatedPlan);
      return true;
    }

    // For paid plan users who have used all free posts
    if (planData.postsGenerated >= planData.postsLimit) {
      return false;
    }

    const updatedPlan = {
      ...planData,
      postsGenerated: planData.postsGenerated + 1
    };

    this.savePlanData(userId, updatedPlan);
    return true;
  }

  private savePlanData(userId: string, planData: UserPlanInfo): void {
    localStorage.setItem(this.getStorageKey(userId), JSON.stringify(planData));
  }

  canGeneratePost(userId: string): boolean {
    const planData = this.getUserPlan({ id: userId } as User);
    if (!planData) return false;

    // For paid plans, check both free posts and plan posts
    if (planData.name !== 'free') {
      return planData.freePostsUsed < FREE_MONTHLY_POSTS || planData.postsGenerated < planData.postsLimit;
    }

    // For free plan, only check free posts
    return planData.freePostsUsed < FREE_MONTHLY_POSTS;
  }

  getRemainingPosts(userId: string): number {
    const planData = this.getUserPlan({ id: userId } as User);
    if (!planData) return 0;

    // Calculate remaining free posts
    const remainingFreePosts = Math.max(0, FREE_MONTHLY_POSTS - planData.freePostsUsed);

    // For paid plans, add remaining plan posts to free posts
    if (planData.name !== 'free') {
      if (planData.postsLimit === Infinity) {
        return remainingFreePosts > 0 ? remainingFreePosts : Infinity;
      }
      return remainingFreePosts + Math.max(0, planData.postsLimit - planData.postsGenerated);
    }

    // For free plan, just return remaining free posts
    return remainingFreePosts;
  }

  getTotalPostsGenerated(userId: string): number {
    const planData = this.getUserPlan({ id: userId } as User);
    if (!planData) return 0;
    return planData.freePostsUsed + planData.postsGenerated;
  }

  getPostsLimit(userId: string): number {
    const planData = this.getUserPlan({ id: userId } as User);
    if (!planData) return 0;
    return planData.name === 'free' ? FREE_MONTHLY_POSTS : planData.postsLimit;
  }
}

export const userPlanService = UserPlanService.getInstance(); 
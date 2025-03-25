import { AlertCircle } from 'lucide-react';

const MobileWarning = () => {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="glass-card p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold mb-1">Better on Desktop</h4>
          <p className="text-sm text-muted-foreground">
            For the best experience, please use a computer or switch to desktop mode in your browser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileWarning; 
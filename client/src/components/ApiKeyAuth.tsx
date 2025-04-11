import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { UPLOAD_KEY } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyAuthProps {
  onAuthenticated: () => void;
}

const ApiKeyAuth = ({ onAuthenticated }: ApiKeyAuthProps) => {
  const [key, setKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simple validation
    if (!key.trim()) {
      setError("please enter an api key");
      setIsLoading(false);
      return;
    }

    // Check if key matches
    setTimeout(() => {
      if (key === UPLOAD_KEY) {
        toast({
          title: "authenticated",
          description: "you now have access to the api documentation",
        });
        onAuthenticated();
      } else {
        setError("invalid api key");
        toast({
          title: "authentication failed",
          description: "the api key you entered is invalid",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 600); // Slight delay to simulate verification
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <Card className="w-full max-w-md bg-black border border-gray-800">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="bg-gray-900 p-3 rounded-full mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2 lowercase">api authentication required</h2>
            <p className="text-gray-400 lowercase">
              you need a valid api key to access the documentation. use the same key required for uploads.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="enter your api key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="bg-black border border-gray-700 text-white lowercase"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-1 lowercase">{error}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-indigo-500 text-white lowercase"
              disabled={isLoading}
            >
              {isLoading ? "authenticating..." : "authenticate"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyAuth;
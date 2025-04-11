import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <Card className="w-full max-w-md mx-4 bg-black border border-gray-800">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-white lowercase">404 page not found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-400 lowercase">
            did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

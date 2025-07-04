"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Settings, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { EXPENSE_CATEGORIES } from "@/lib/categories";

const budgetSchema = z.object({
  budgets: z.record(z.string(), z.number().min(0, "Budget must be positive")),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface Budget {
  category: string;
  amount: number;
}

interface BudgetManagerProps {
  onBudgetUpdate?: () => void;
}

export function BudgetManager({ onBudgetUpdate }: BudgetManagerProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const { toast } = useToast();

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      budgets: {},
    },
  });

  useEffect(() => {
    if (open) {
      fetchBudgets();
    }
  }, [open]);

  const fetchBudgets = async () => {
    try {
      const response = await fetch("/api/budgets");
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);

        const budgetMap: Record<string, number> = {};
        data.forEach((budget: Budget) => {
          budgetMap[budget.category] = budget.amount;
        });
        form.reset({ budgets: budgetMap });
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const onSubmit = async (data: BudgetFormData) => {
    setIsLoading(true);
    try {
      const budgetArray = Object.entries(data.budgets)
        .filter(([_, amount]) => amount > 0)
        .map(([category, amount]) => ({ category, amount }));

      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ budgets: budgetArray }),
      });

      if (!response.ok) {
        throw new Error("Failed to save budgets");
      }

      toast({
        title: "Success",
        description: "Budgets saved successfully",
      });

      setOpen(false);
      onBudgetUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save budgets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto bg-transparent"
        >
          <Settings className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Manage Budgets</span>
          <span className="sm:hidden">Budgets</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-[95vw] max-w-[600px] max-h-[85vh] overflow-hidden select-none"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="select-none">
          <DialogTitle className="text-lg sm:text-xl select-none">
            Monthly Budget Settings
          </DialogTitle>
          <DialogDescription className="text-sm select-none">
            Set your monthly spending limits for each category
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 select-none"
            >
              <div className="grid gap-4">
                {EXPENSE_CATEGORIES.map((category) => (
                  <FormField
                    key={category.id}
                    control={form.control}
                    name={`budgets.${category.id}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm select-none">
                          <span className="select-none">{category.icon}</span>
                          <span className="select-none">{category.name}</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="text-sm select-text"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? Number(e.target.value) : 0
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage className="select-none" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="w-full sm:w-auto select-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto select-none"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  Save Budgets
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

"use client"

import { useEffect, useState, useCallback } from "react"
import { format } from "date-fns"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { EditTransactionDialog } from "@/components/edit-transaction-dialog"
import { DeleteTransactionDialog } from "@/components/delete-transaction-dialog"
import { getCategoryById } from "@/lib/categories"

interface Transaction {
  _id: string
  amount: number
  date: string
  description: string
  category: string
  createdAt: string
}

interface TransactionListProps {
  onTransactionChange?: () => void
  refreshTrigger?: number
}

export function TransactionList({ onTransactionChange, refreshTrigger }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsInitialLoading(true)
      setError(null)
      const response = await fetch("/api/transactions", {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }

      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      setError("Failed to load transactions")
    } finally {
      if (showLoading) setIsInitialLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchTransactions(false)
    }
  }, [refreshTrigger, fetchTransactions])

  const handleOptimisticDelete = async (transactionId: string) => {
    const originalTransactions = [...transactions]
    setTransactions((prev) => prev.filter((t) => t._id !== transactionId))

    try {
      const response = await fetch("/api/transactions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: transactionId }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete transaction")
      }

      onTransactionChange?.()
    } catch (error) {
      setTransactions(originalTransactions)
      throw error
    }
  }

  const handleOptimisticUpdate = async (updatedTransaction: any) => {
    const originalTransactions = [...transactions]
    setTransactions((prev) =>
      prev.map((t) =>
        t._id === updatedTransaction.id ? { ...t, ...updatedTransaction, _id: updatedTransaction.id } : t,
      ),
    )

    try {
      const response = await fetch("/api/transactions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTransaction),
      })

      if (!response.ok) {
        throw new Error("Failed to update transaction")
      }

      onTransactionChange?.()
    } catch (error) {
      setTransactions(originalTransactions)
      throw error
    }
  }

  if (isInitialLoading) {
    return (
      <div className="space-y-4">
        {/* Desktop Table Skeleton */}
        <div className="hidden md:block">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile Cards Skeleton */}
        <div className="md:hidden space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={() => fetchTransactions()} className="mt-2 bg-transparent">
          Try Again
        </Button>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transactions yet. Add your first transaction above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {format(new Date(transaction.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate">{transaction.description}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{getCategoryById(transaction.category).icon}</span>
                      <span className="text-sm text-muted-foreground hidden lg:inline">
                        {getCategoryById(transaction.category).name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={transaction.amount < 0 ? "destructive" : "default"}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <EditTransactionDialog
                        transaction={{
                          id: transaction._id,
                          amount: transaction.amount,
                          date: transaction.date,
                          description: transaction.description,
                          category: transaction.category,
                        }}
                        onOptimisticUpdate={handleOptimisticUpdate}
                      >
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </EditTransactionDialog>
                      <DeleteTransactionDialog
                        transactionId={transaction._id}
                        onOptimisticDelete={handleOptimisticDelete}
                      >
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DeleteTransactionDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {transactions.map((transaction) => {
          const category = getCategoryById(transaction.category)
          return (
            <Card key={transaction._id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span className="font-medium text-sm">{category.name}</span>
                      <Badge variant={transaction.amount < 0 ? "destructive" : "default"} className="text-xs">
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <EditTransactionDialog
                      transaction={{
                        id: transaction._id,
                        amount: transaction.amount,
                        date: transaction.date,
                        description: transaction.description,
                        category: transaction.category,
                      }}
                      onOptimisticUpdate={handleOptimisticUpdate}
                    >
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </EditTransactionDialog>
                    <DeleteTransactionDialog
                      transactionId={transaction._id}
                      onOptimisticDelete={handleOptimisticDelete}
                    >
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DeleteTransactionDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

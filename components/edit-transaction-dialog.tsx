"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TransactionForm } from "@/components/transaction-form"

interface EditTransactionDialogProps {
  children: React.ReactNode
  transaction: {
    id: string
    amount: number
    date: string
    description: string
    category?: string
  }
  onOptimisticUpdate?: (transaction: any) => Promise<void>
}

export function EditTransactionDialog({ children, transaction, onOptimisticUpdate }: EditTransactionDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>Make changes to your transaction here.</DialogDescription>
        </DialogHeader>
        <TransactionForm transaction={transaction} onSuccess={handleSuccess} onOptimisticUpdate={onOptimisticUpdate} />
      </DialogContent>
    </Dialog>
  )
}

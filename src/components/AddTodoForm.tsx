import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Todo } from "./TodoApp";

interface AddTodoFormProps {
  onAdd: (todo: Omit<Todo, "id" | "createdAt" | "completed">) => void;
  onCancel: () => void;
}

export const AddTodoForm = ({ onAdd, onCancel }: AddTodoFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Todo["priority"]>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
  };

  return (
    <div className="glass-panel rounded-xl p-6 border border-primary/30 neon-glow slide-up">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-primary">New Mission</h3>
          <Button
            type="button"
            onClick={onCancel}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Mission Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter mission title..."
              className="bg-muted/50 border-border/50 focus:border-primary"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (Optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter mission description..."
              className="bg-muted/50 border-border/50 focus:border-primary resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Todo["priority"])}
              className="w-full bg-muted/50 border border-border/50 rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🔵 Medium Priority</option>
              <option value="high">🟣 High Priority</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            variant="default"
            className="flex-1"
            disabled={!title.trim()}
          >
            <Plus className="h-4 w-4" />
            Create Mission
          </Button>
          <Button type="button" onClick={onCancel} variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
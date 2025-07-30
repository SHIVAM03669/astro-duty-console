import { useState } from "react";
import {
  Check,
  X,
  Edit,
  Trash2,
  Calendar,
  Flag,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Todo } from "./TodoApp";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

const priorityColors = {
  low: "border-neon-green/50 bg-neon-green/5",
  medium: "border-primary/50 bg-primary/5",
  high: "border-neon-purple/50 bg-neon-purple/5",
};

const priorityGlow = {
  low: "neon-glow-green",
  medium: "neon-glow",
  high: "neon-glow-purple",
};

export const TodoItem = ({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || "");
  const [editPriority, setEditPriority] = useState(todo.priority);

  const handleSave = () => {
    onUpdate(todo.id, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div
      className={cn(
        "glass-panel rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]",
        priorityColors[todo.priority],
        todo.completed && "opacity-75",
        !todo.completed && priorityGlow[todo.priority]
      )}
    >
      {isEditing ? (
        <div className="space-y-4">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="bg-muted/50 border-border/50 focus:border-primary"
            placeholder="Mission title..."
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="bg-muted/50 border-border/50 focus:border-primary resize-none"
            placeholder="Mission description..."
            rows={3}
          />
          <div className="flex gap-2">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Todo["priority"])}
              className="bg-muted/50 border border-border/50 rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} variant="success" size="sm">
              <Check className="h-4 w-4" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Button
                onClick={() => onToggle(todo.id)}
                variant={todo.completed ? "success" : "outline"}
                size="icon"
                className="shrink-0"
              >
                {todo.completed && <Check className="h-4 w-4" />}
              </Button>
              <div className="flex-1">
                <h3
                  className={cn(
                    "text-lg font-medium transition-all",
                    todo.completed && "text-muted-foreground"
                  )}
                >
                  {todo.title}
                </h3>
                {todo.description && (
                  <p
                    className={cn(
                      "text-sm text-muted-foreground mt-1"
                    )}
                  >
                    {todo.description}
                  </p>
                )}
              </div>
            </div>

            {/* Priority Badge */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                  todo.priority === "high" && "bg-neon-purple/20 text-neon-purple",
                  todo.priority === "medium" && "bg-primary/20 text-primary",
                  todo.priority === "low" && "bg-neon-green/20 text-neon-green"
                )}
              >
                <Flag className="h-3 w-3" />
                {todo.priority.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created {formatDate(todo.createdAt)}
              </div>
              {todo.completedAt && (
                <div className="flex items-center gap-1 text-neon-green">
                  <Clock className="h-3 w-3" />
                  Completed {formatDate(todo.completedAt)}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-1">
              <Button
                onClick={() => setIsEditing(true)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-primary"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => onDelete(todo.id)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
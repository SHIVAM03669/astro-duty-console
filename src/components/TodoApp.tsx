import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TodoItem } from "./TodoItem";
import { AddTodoForm } from "./AddTodoForm";
import { cn } from "@/lib/utils";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  completedAt?: Date;
}

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("scifi-todos");
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
      }));
      setTodos(parsedTodos);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("scifi-todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todoData: Omit<Todo, "id" | "createdAt" | "completed">) => {
    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date(),
    };
    setTodos(prev => [newTodo, ...prev]);
    setShowAddForm(false);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? new Date() : undefined,
            }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  };

  // Filter todos based on search query and filter
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !todo.completed) ||
      (filter === "completed" && todo.completed);
    return matchesSearch && matchesFilter;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-neon-blue to-neon-purple bg-clip-text text-transparent">
            NEXUS TASKS
          </h1>
          <p className="text-lg text-muted-foreground">
            Advanced Task Management System
          </p>
          <div className="text-sm text-muted-foreground">
            {completedCount} of {totalCount} missions completed
          </div>
        </div>

        {/* Controls */}
        <div className="glass-panel rounded-xl p-6 space-y-4 slide-up">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search missions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Add Todo Button */}
            <Button
              onClick={() => setShowAddForm(true)}
              variant="neon"
              className="whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              New Mission
            </Button>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {(["all", "active", "completed"] as const).map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterType)}
                className="capitalize"
              >
                {filterType}
              </Button>
            ))}
          </div>
        </div>

        {/* Add Todo Form */}
        {showAddForm && (
          <AddTodoForm
            onAdd={addTodo}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="glass-panel rounded-xl p-12 text-center slide-up">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-medium mb-2">No missions found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Create your first mission to get started"}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className={cn("slide-up", `delay-${index * 100}`)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TodoItem
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onUpdate={updateTodo}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {todos.length > 0 && (
          <div className="glass-panel rounded-xl p-6 slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {totalCount}
                </div>
                <div className="text-sm text-muted-foreground">Total Missions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-neon-green">
                  {completedCount}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-neon-purple">
                  {Math.round((completedCount / totalCount) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
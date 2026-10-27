import { Check } from 'lucide-react'
import { Task, Priority } from '@/types/todo'

interface TaskSheetProps {
  tasks: Task[]
}

const PRIORITY_TEXT: Record<Priority, { label: string; className: string }> = {
  urgent: { label: 'Urgent', className: 'text-red-500 dark:text-red-400' },
  high: { label: 'High', className: 'text-amber-600 dark:text-amber-400' },
  medium: { label: 'Medium', className: 'text-yellow-600 dark:text-yellow-400' },
  low: { label: 'Low', className: 'text-emerald-600 dark:text-emerald-400' },
}

const COLUMNS = ['Done', 'Title', 'Description', 'Category', 'Priority', 'Due date', 'Created']

function formatDate(value?: string): string {
  if (!value) return ''
  // Due dates are plain YYYY-MM-DD; parse them as local dates to avoid timezone shifts
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

// Read-only spreadsheet-style grid of tasks
export function TaskSheet({ tasks }: TaskSheetProps) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="card-chai mt-2 overflow-hidden">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full min-w-[820px] border-collapse text-xs sm:text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-muted text-muted-foreground">
              <th
                scope="col"
                className="w-10 border border-border px-2 py-2 text-center font-medium"
                aria-label="Row number"
              />
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="border border-border px-3 py-2 text-left font-semibold text-foreground whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => {
              const priority = PRIORITY_TEXT[task.priority] ?? PRIORITY_TEXT.medium
              const overdue = !task.completed && !!task.dueDate && task.dueDate < today

              return (
                <tr key={task.id} className="hover:bg-muted/40">
                  <th
                    scope="row"
                    className="border border-border bg-muted px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
                  >
                    {index + 1}
                  </th>
                  <td className="border border-border px-3 py-1.5 text-center">
                    {task.completed ? (
                      <Check className="mx-auto h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-label="Completed" />
                    ) : (
                      <span className="text-muted-foreground" aria-label="Not completed">–</span>
                    )}
                  </td>
                  <td
                    className={`border border-border px-3 py-1.5 font-medium ${
                      task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}
                  >
                    {task.title}
                  </td>
                  <td className="max-w-xs border border-border px-3 py-1.5 text-muted-foreground">
                    <div className="line-clamp-2" title={task.description}>
                      {task.description}
                    </div>
                  </td>
                  <td className="border border-border px-3 py-1.5 whitespace-nowrap">{task.category}</td>
                  <td className={`border border-border px-3 py-1.5 whitespace-nowrap font-medium ${priority.className}`}>
                    {priority.label}
                  </td>
                  <td
                    className={`border border-border px-3 py-1.5 whitespace-nowrap ${
                      overdue ? 'font-medium text-red-500 dark:text-red-400' : ''
                    }`}
                  >
                    {formatDate(task.dueDate)}
                    {overdue && <span className="ml-1 text-xs">(overdue)</span>}
                  </td>
                  <td className="border border-border px-3 py-1.5 whitespace-nowrap text-muted-foreground">
                    {formatDate(task.createdAt)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

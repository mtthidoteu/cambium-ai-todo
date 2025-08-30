import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TodoApp from '../TodoApp'
import * as useTasksModule from '@/hooks/useTasks'

// Mock the hooks to avoid complex API mocking
vi.mock('@/hooks/useTasks', () => ({
  useTasks: vi.fn(() => ({
    data: [
      {
        id: 1,
        title: 'Test task 1',
        completed: false,
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 2, 
        title: 'Test task 2',
        completed: true,
        created_at: '2024-01-14T15:30:00Z'
      }
    ],
    isLoading: false,
    error: null
  })),
  useCreateTask: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false
  })),
  useUpdateTask: vi.fn(() => ({
    mutate: vi.fn()
  })),
  useDeleteTask: vi.fn(() => ({
    mutate: vi.fn()
  }))
}))

// Mock toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn()
  }))
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// Get mocked functions for use in tests
const mockUseTasks = vi.mocked(useTasksModule.useTasks)
const mockUseCreateTask = vi.mocked(useTasksModule.useCreateTask)
const mockUseUpdateTask = vi.mocked(useTasksModule.useUpdateTask)
const mockUseDeleteTask = vi.mocked(useTasksModule.useDeleteTask)

describe('TodoApp', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
    
    // Restore default mock implementations
    mockUseTasks.mockReturnValue({
      data: [
        {
          id: 1,
          title: 'Test task 1',
          completed: false,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2, 
          title: 'Test task 2',
          completed: true,
          created_at: '2024-01-14T15:30:00Z'
        }
      ],
      isLoading: false,
      error: null
    })
    
    mockUseCreateTask.mockReturnValue({
      mutate: vi.fn(),
      isPending: false
    })
    
    mockUseUpdateTask.mockReturnValue({
      mutate: vi.fn()
    })
    
    mockUseDeleteTask.mockReturnValue({
      mutate: vi.fn()
    })
  })

  it('renders todo app with main elements', () => {
    render(<TodoApp />, { wrapper: createWrapper() })
    
    // Check for main heading
    expect(screen.getByRole('heading', { name: /my tasks/i })).toBeInTheDocument()
    
    // Check for input field
    expect(screen.getByPlaceholderText(/add a new task/i)).toBeInTheDocument()
    
    // Check for add button
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument()
  })

  it('displays existing tasks from mock data', () => {
    render(<TodoApp />, { wrapper: createWrapper() })
    
    expect(screen.getByText('Test task 1')).toBeInTheDocument()
    expect(screen.getByText('Test task 2')).toBeInTheDocument()
  })

  it('shows correct progress information', () => {
    render(<TodoApp />, { wrapper: createWrapper() })
    
    // Check for individual progress elements - text is split across elements
    expect(screen.getByText('active task')).toBeInTheDocument()
    expect(screen.getByText('completed')).toBeInTheDocument()
    // Check that we have progress stats displayed
    expect(screen.getAllByText('1')).toHaveLength(2) // One for active, one for completed
  })

  it('allows typing in input field', async () => {
    const user = userEvent.setup()
    render(<TodoApp />, { wrapper: createWrapper() })
    
    const input = screen.getByPlaceholderText(/add a new task/i) as HTMLInputElement
    
    await user.type(input, 'New test task')
    expect(input.value).toBe('New test task')
  })

  it('handles empty state correctly', () => {
    // Override mock to return empty array
    mockUseTasks.mockReturnValueOnce({
      data: [],
      isLoading: false,
      error: null
    })

    render(<TodoApp />, { wrapper: createWrapper() })
    
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
  })

  it('handles loading state correctly', () => {
    // Override mock to return loading state
    mockUseTasks.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      error: null
    })

    render(<TodoApp />, { wrapper: createWrapper() })
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('calls mutation when adding task', async () => {
    const mockMutate = vi.fn()
    
    // Override mock to use our custom mutate function
    mockUseCreateTask.mockReturnValue({
      mutate: mockMutate,
      isPending: false
    })

    const user = userEvent.setup()
    render(<TodoApp />, { wrapper: createWrapper() })
    
    const input = screen.getByPlaceholderText(/add a new task/i)
    const button = screen.getByRole('button', { name: /add task/i })
    
    await user.type(input, 'New task')
    await user.click(button)
    
    expect(mockMutate).toHaveBeenCalledWith({ title: 'New task' })
  })

  it('prevents adding empty tasks', async () => {
    const mockMutate = vi.fn()
    
    // Override mock to use our custom mutate function
    mockUseCreateTask.mockReturnValue({
      mutate: mockMutate,
      isPending: false
    })

    const user = userEvent.setup()
    render(<TodoApp />, { wrapper: createWrapper() })
    
    const button = screen.getByRole('button', { name: /add task/i })
    await user.click(button)
    
    expect(mockMutate).not.toHaveBeenCalled()
  })
})
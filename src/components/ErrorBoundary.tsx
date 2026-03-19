import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Judgment Engine error:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div role="alert" style={styles.container}>
          <h2 style={styles.title}>Something went wrong</h2>
          <p style={styles.message}>{this.state.error.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            style={styles.button}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 480,
    margin: "40px auto",
    padding: 24,
    background: "#fff",
    borderRadius: 8,
    border: "1px solid #e0e0e0",
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
    color: "#c33",
  },
  message: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  button: {
    padding: "8px 16px",
    fontSize: 14,
    cursor: "pointer",
    background: "#333",
    color: "#fff",
    border: "none",
    borderRadius: 6,
  },
};

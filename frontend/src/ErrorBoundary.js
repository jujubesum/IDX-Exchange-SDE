import React from 'react';

// Error boundaries must be class components: React has no hook equivalent
// of getDerivedStateFromError / componentDidCatch.
export default class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught a render error:', error, info.componentStack);
  }

  // Leaving the broken page (resetKey changes) clears the error automatically
  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div role="alert" style={{ padding: '24px' }}>
        <h2>Something went wrong</h2>
        <p>This page hit an unexpected error. Your other pages should still work.</p>
        <button type="button" onClick={this.reset}>Try again</button>{' '}
        {/* plain <a> on purpose: a full reload clears any bad app state */}
        <a href="/">Back to listings</a>
      </div>
    );
  }
}
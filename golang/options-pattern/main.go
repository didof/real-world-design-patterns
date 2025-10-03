package main

import "time"

type APIClient struct {
	timeout   time.Duration
	authToken *string
	retries   int
}

func NewAPIClient(opts ...Option) *APIClient {
	c := &APIClient{
		timeout:   30 * time.Second,
		authToken: nil,
		retries:   0,
	}

	for _, opt := range opts {
		opt(c)
	}

	return c
}

type Option func(*APIClient)

func WithTimeout(timeout time.Duration) Option {
	return func(c *APIClient) {
		c.timeout = timeout
	}
}

func WithRetries(retries int) Option {
	return func(c *APIClient) {
		c.retries = retries
	}
}

func main() {

	NewAPIClient(
		WithTimeout(420),
	)

	NewAPIClient(
		WithRetries(30),
	)
}

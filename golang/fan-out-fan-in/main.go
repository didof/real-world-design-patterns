package main

import (
	"fmt"
	"net"
	"sort"
	"sync"
)

// GeneratePorts creates a channel and populates it with port numbers in the background.
func GeneratePorts() <-chan int {
	ports := make(chan int, 200) // Buffered channel
	go func() {
		defer close(ports) // Ensure the channel is closed when the goroutine finishes
		for i := 1; i <= 65535; i++ {
			ports <- i
		}
	}()
	return ports
}

// worker is a concurrent worker that reads ports, scans them, and sends results.
func worker(wg *sync.WaitGroup, ports <-chan int, results chan<- int) {
	defer wg.Done() // Signal completion to the WaitGroup
	for p := range ports {
		address := fmt.Sprintf("127.0.0.1:%d", p)
		conn, err := net.Dial("tcp", address)
		if err != nil {
			// Port is closed or filtered
			continue
		}
		conn.Close()
		results <- p
	}
}

func main() {
	// --- Fan-Out Phase ---
	ports := GeneratePorts()
	results := make(chan int)
	var wg sync.WaitGroup
	const numWorkers = 1 // Worker pool size

	for i := 0; i < numWorkers; i++ {
		wg.Add(1) // Increment counter *before* launching goroutine
		go worker(&wg, ports, results)
	}

	// --- Fan-In Phase ---
	// Launch a coordinator goroutine to close the results channel when all workers are done.
	go func() {
		wg.Wait()
		close(results)
	}()

	// Collect results from the fan-in
	var openPorts []int
	for r := range results {
		openPorts = append(openPorts, r)
	}

	// --- Print Results ---
	fmt.Printf("Scan complete. Open ports: %d\n", len(openPorts))
	sort.Ints(openPorts)
	for _, port := range openPorts {
		fmt.Printf("%d open\n", port)
	}
}

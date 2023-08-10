import Table from 'cli-table3';

export async function measureAsync(fn, iterations, verbose, ...args) {
  let totalDuration = 0;

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn(...args);
    const end = performance.now();
    const duration = end - start;
    totalDuration += duration;
    if (verbose) {
      console.info(
        `Iteration n. ${i + 1}: Execution Time ${duration.toFixed(2)} ms`
      );
    }
  }

  const averageDuration = totalDuration / iterations;

  const benchmarkResults = [];
  benchmarkResults.push({ functionName: fn.name, iterations, averageDuration });
  const table = generateBenchmarkTable(benchmarkResults);
  console.log(table);
}

export function measureSync(fn, iterations, verbose, ...args) {
  let totalDuration = 0;

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn(...args);
    const end = performance.now();
    const duration = end - start;
    totalDuration += duration;
    if (verbose) {
      console.info(
        `Iteration n. ${i + 1}: Execution Time ${duration.toFixed(2)} ms`
      );
    }
  }

  const averageDuration = totalDuration / iterations;

  const benchmarkResults = [];
  benchmarkResults.push({ functionName: fn.name, iterations, averageDuration });
  const table = generateBenchmarkTable(benchmarkResults);
  console.log(table);
}

function generateBenchmarkTable(results) {
  const table = new Table({
    head: ['Function', 'N. Iterations', 'Avg Duration (ms)'],
    colWidths: [20, 20, 20]
  });

  for (const result of results) {
    table.push([
      result.functionName,
      result.iterations,
      result.averageDuration.toFixed(2)
    ]);
  }

  return table.toString();
}

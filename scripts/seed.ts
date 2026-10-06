async function main(): Promise<void> {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "info",
      message: "No seed fixtures defined yet",
    }),
  );
}

void main();

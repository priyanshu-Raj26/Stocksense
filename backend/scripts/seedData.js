async function runSeed() {
  // TODO: implement Yahoo fetch + metrics + DB inserts in Step 4.
  console.log(
    "Seed script scaffold is ready. Implementation comes in the next steps.",
  );
}

runSeed().catch((err) => {
  console.error("Seed script failed:", err.message);
  process.exit(1);
});

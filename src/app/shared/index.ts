async function asyncHandler(promise: Promise<Response>) {
  const isFulfilled = <T>(p: PromiseSettledResult<T>): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';
  const isRejected = <T>(p: PromiseSettledResult<T>): p is PromiseRejectedResult => p.status === 'rejected';

  const results = await Promise.allSettled([promise]);
  const fulfilledValues = results.filter(isFulfilled).map((p) => p.value);
  const rejectedReasons = results.filter(isRejected).map((p) => p.reason);

  return { data: fulfilledValues, error: rejectedReasons };
}

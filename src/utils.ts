export function addDisposable(fn: () => any, disposables: any[]) {
    const disposable = fn();
    disposables.push(disposable);
    return disposable;
}
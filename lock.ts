export function useLock(skiaContext, key: string) {
    const POLL_INTERVAL_MS = 50;

    if (!skiaContext.locks[key]) {
        skiaContext.locks[key] = {
            isLocked: false,
            lockerKey: null
        }
    }

    async function acquireLock(lockerKey: string) {
        const lock = skiaContext.locks[key];

        if (!lock) {
            throw new Error(`Lock ${key} not found`);
        }

        if (!lock.isLocked) {
            lock.isLocked = true;
            lock.lockerKey = lockerKey;
            return;
        }

        return new Promise<void>((resolve) => {
            const checkValue = () => {
                if (!lock.isLocked) {
                    lock.isLocked = true;
                    lock.lockerKey = lockerKey;
                    return void resolve();
                }
                setTimeout(checkValue, POLL_INTERVAL_MS);
            }
            checkValue();
        });
    }

    function releaseLock(lockerKey: string) {
        const lock = skiaContext.locks[key];

        if (!lock) {
            throw new Error(`Lock ${key} not found`);
        }

        if (lock.lockerKey !== lockerKey) {
            return;
            // throw new Error(`Incorrect locker key ${lockerKey}. Should be ${lock.lockerKey}`);
        }

        lock.isLocked = false;
        lock.lockerKey = null;
    }

    return {
        acquireLock,
        releaseLock
    }
}
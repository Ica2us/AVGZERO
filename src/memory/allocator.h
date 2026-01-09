#ifndef ALLOCATOR_H
#define ALLOCATOR_H

#include <cstddef>

namespace avg {

// Simple memory allocator for WASM environment
// Note: This allocator tracks allocation statistics for debugging purposes.
// The totalBytesRequested counter tracks cumulative bytes requested, not current usage.
class Allocator {
public:
    static Allocator& getInstance();

    void* allocate(size_t size);
    void deallocate(void* ptr);
    void* reallocate(void* ptr, size_t newSize);

    // Returns total bytes ever requested (not current usage)
    size_t getTotalBytesRequested() const { return totalBytesRequested; }
    // Returns current number of active allocations
    size_t getAllocationCount() const { return allocationCount; }

    void reset();

private:
    Allocator();
    ~Allocator();

    Allocator(const Allocator&) = delete;
    Allocator& operator=(const Allocator&) = delete;

    size_t totalBytesRequested;
    size_t allocationCount;
};

} // namespace avg

// Override global new/delete operators (optional)
// void* operator new(size_t size);
// void operator delete(void* ptr) noexcept;

#endif // ALLOCATOR_H

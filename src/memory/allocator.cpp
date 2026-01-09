#include "allocator.h"
#include <cstdlib>
#include <cstring>

namespace avg {

Allocator::Allocator() : totalBytesRequested(0), allocationCount(0) {
}

Allocator::~Allocator() {
}

Allocator& Allocator::getInstance() {
    static Allocator instance;
    return instance;
}

void* Allocator::allocate(size_t size) {
    if (size == 0) {
        return nullptr;
    }

    void* ptr = std::malloc(size);
    if (ptr) {
        totalBytesRequested += size;
        allocationCount++;
    }

    return ptr;
}

void Allocator::deallocate(void* ptr) {
    if (!ptr) {
        return;
    }

    std::free(ptr);
    allocationCount--;
}

void* Allocator::reallocate(void* ptr, size_t newSize) {
    if (newSize == 0) {
        deallocate(ptr);
        return nullptr;
    }

    void* newPtr = std::realloc(ptr, newSize);
    if (newPtr) {
        totalBytesRequested += newSize;
    }

    return newPtr;
}

void Allocator::reset() {
    totalBytesRequested = 0;
    allocationCount = 0;
}

} // namespace avg

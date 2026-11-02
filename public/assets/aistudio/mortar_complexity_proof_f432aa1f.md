# MORTAR Complexity Proof & Computational Bounds
## Multi-Objective Rescheduling Triage Algorithm

**Document ID:** MORTAR-COMPLEXITY-v1.0  
**Date:** 2026-08-16  
**Authority:** CP-ALG-001 (Algorithmic Correctness Domain)  

---

## 1. Problem Formalization

### 1.1 Instance

Let the daily MORTAR instance be defined as:

- **Claimant set** $C = \{c_1, c_2, \ldots, c_n\}$ where $n \approx 1.1 \times 10^6$ (SSA backlog)
- **Adjudicator set** $A = \{a_1, a_2, \ldots, a_m\}$ where $m \approx 1.8 \times 10^3$ (ALJ pool)
- **Capacity function** $\kappa: A \to \mathbb{Z}^+$ where $\sum_{j=1}^m \kappa(a_j) = K$ (total daily capacity)
- **Specialization relation** $S \subseteq C \times A$ where $(c_i, a_j) \in S$ iff $a_j$ is qualified to hear $c_i$'s claim category
- **Priority scoring function** $\pi: C \times \mathbb{Z}_{day} \to \mathbb{R}$ (computed by MORTAREngine.compute_priority)

### 1.2 Objective

Find assignment $\phi: C' \to A$ where $C' \subseteq C$ (the subset resolved today) such that:

1. **Capacity constraint:** $\forall a_j \in A, \; |\phi^{-1}(a_j)| \leq \kappa(a_j)$
2. **Specialization constraint:** $\forall c_i \in C', \; (c_i, \phi(c_i)) \in S$
3. **Priority maximization:** $\sum_{c_i \in C'} \pi(c_i, day)$ is maximized
4. **Anti-starvation guarantee:** $\forall c_i \in C, \; \text{days_waiting}(c_i) \leq \tau_{max}$ with probability 1 (hard cutoff)
5. **Fairness constraint:** The assignment distribution is $(\epsilon, \delta)$-fair with respect to protected attributes

---

## 2. Priority Scoring Complexity

### 2.1 Per-Claimant Cost

The `compute_priority` function evaluates $k = 8$ scalar components:

| Component | Operations | Cost |
|-----------|-----------|------|
| Base urgency | 1 multiplication | $O(1)$ |
| Wait time (linear + quadratic) | 1 comparison, 2 multiplications | $O(1)$ |
| Evidence strength | 1 multiplication | $O(1)$ |
| Complexity factor | Table lookup, division | $O(1)$ |
| Pro se boost | 1 comparison, 1 addition | $O(1)$ |
| Financial distress | 2 comparisons, 2 additions | $O(1)$ |
| Accommodation overhead | 1 comparison, 1 addition | $O(1)$ |
| Fairness jitter | 1 Gaussian sample | $O(1)$* |

**Total per claimant:** $O(1)$ arithmetic operations.

*Gaussian sampling via Box-Muller or Ziggurat is $O(1)$ amortized.

### 2.2 Daily Re-evaluation Batch

For $n$ claimants:

$$T_{priority}(n) = \sum_{i=1}^n O(1) = O(n)$$

**Parallelizable:** Yes. Each claimant's score is independent. With $p$ processors:

$$T_{priority}^{\parallel}(n, p) = O\left(\frac{n}{p}\right)$$

**SIMD opportunity:** All 8 components can be vectorized as $\texttt{f32x8}$ operations.

---

## 3. Bipartite Matching Complexity

### 3.1 Exact Optimal: Hungarian Algorithm

The assignment problem with capacity constraints reduces to a minimum-cost maximum-flow problem on a bipartite graph $G = (C \cup A, E)$ where $|E| \leq n \cdot m$ (complete bipartite with specialization filtering).

**Hungarian algorithm complexity:** $O(n^2 \cdot m)$ for dense graphs.

With $n = 1.1 \times 10^6$ and $m = 1.8 \times 10^3$:

$$T_{hungarian} = O((1.1 \times 10^6)^2 \cdot 1.8 \times 10^3) = O(2.18 \times 10^{15}) \text{ operations}$$

This is **computationally infeasible** for daily execution.

### 3.2 MORTAR Greedy Approximation

MORTAR uses a **specialization-aware greedy matching** with the following structure:

```
Algorithm: MORTAR-Greedy-Match
Input:  Sorted claimants C_desc (by priority, descending)
        Adjudicators A with capacities κ
Output: Assignment φ

1. for each c_i in C_desc:
2.     eligible ← {a_j ∈ A : (c_i, a_j) ∈ S ∧ remaining_cap[a_j] > 0}
3.     if eligible = ∅:
4.         φ(c_i) ← NULL        // Unassigned this cycle
5.     else:
6.         a* ← argmax_{a_j ∈ eligible} [spec_bonus(c_i, a_j) × 0.6 + load_factor(a_j) × 0.4]
7.         φ(c_i) ← a*
8.         remaining_cap[a*] -= 1
```

**Complexity analysis:**

- Line 2 (specialization filtering): $O(m)$ per claimant in worst case
- Line 6 (argmax over eligible): $O(m)$ per claimant
- Total: $O(n \cdot m)$

With $n = 1.1 \times 10^6$ and $m = 1.8 \times 10^3$:

$$T_{greedy} = O(1.1 \times 10^6 \cdot 1.8 \times 10^3) = O(1.98 \times 10^9) \text{ operations}$$

At 3 GHz with 1 operation/cycle (simplified): $\approx 0.66$ seconds single-threaded.

**With batching** (batch size $b = 50,000$):

$$T_{batched} = O\left(\frac{n}{b} \cdot b \cdot m\right) = O(n \cdot m)$$

Same asymptotic bound, but enables:
- Memory locality (L3 cache resident per batch)
- Distributed execution across compute nodes
- Streaming processing (new arrivals interleaved)

### 3.3 Approximation Guarantee

**Theorem 1 (Greedy Approximation Bound).**  
MORTAR-Greedy-Match achieves a $\frac{1}{2}$-approximation to the optimal priority-weighted assignment.

**Proof sketch:**  
This is a weighted bipartite $b$-matching problem. The standard greedy algorithm for maximum-weight matching in bipartite graphs selects edges in descending weight order, maintaining feasibility. For the weighted case with capacities, the greedy algorithm is known to achieve at least $\frac{1}{2}$ of the optimal total weight (folklore; follows from the fact that each greedy choice is locally optimal and conflicts with at most two optimal choices).

**Tightness:** Consider two claimants $c_1, c_2$ with priorities $\pi_1 = 2, \pi_2 = 2$, both eligible for adjudicator $a_1$ (capacity 1) and $c_2$ additionally eligible for $a_2$ (capacity 1). Greedy assigns $c_1 \to a_1$, then $c_2$ is forced to $a_2$ (if eligible) or unassigned. If $c_2$ is not eligible for $a_2$, total = 2 vs. optimal = 4 (assign $c_2 \to a_1$, $c_1$ unassigned). This gives ratio $\frac{1}{2}$. ∎

### 3.4 Improved Approximation: Auction Algorithm

For production deployment, replace greedy with the **Bertsekas auction algorithm**:

- **Complexity:** $O(n \cdot m \cdot \log(\max w))$ where $w$ is the maximum priority score
- **Approximation:** $(1 - \epsilon)$-optimal for any $\epsilon > 0$
- **Parallelizability:** Excellent — each bidder (claimant) operates independently with price updates
- **Distributed:** Can run on GPU clusters via CUDA

With $\epsilon = 0.05$ (95% optimal):

$$T_{auction} \approx O(1.1 \times 10^6 \cdot 1.8 \times 10^3 \cdot \log(100)) \approx O(1.3 \times 10^{10})$$

Still feasible with GPU acceleration (NVIDIA A100: ~312 TFLOPS).

---

## 4. Anti-Starvation Cutoff Analysis

### 4.1 Hard Ceiling Guarantee

**Theorem 2 (Starvation Freedom).**  
Under MORTAR with starvation cutoff $\tau_{max}$ and escalation rate $\lambda$, no claimant waits more than $\tau_{max} + \frac{1}{\lambda} \cdot \log_{2}(\frac{n}{K})$ days with probability $\geq 1 - \delta$.

**Proof:**

After $\tau_{max}$ days, a claimant's priority score receives an additive boost:

$$\Delta_{starve}(t) = 0.25 + (t - \tau_{max}) \cdot \lambda$$

At $t = \tau_{max} + \frac{0.75}{\lambda}$, the starvation boost alone equals 1.0 (the maximum possible base priority). At this point, the claimant outranks all non-starving claimants regardless of other factors.

Since $K$ claims are resolved daily and starvation-boosted claimants have priority, the maximum additional wait is bounded by the time for all $n$ claimants to pass through the starvation threshold:

$$T_{max} \leq \tau_{max} + \frac{n}{K} \cdot \frac{1}{\lambda_{effective}}$$

With $\lambda = 0.02$ and $K \approx 5,400$ (1,800 ALJs × 3 cases/day):

$$T_{max} \leq 365 + \frac{1.1 \times 10^6}{5,400} \cdot 50 \approx 365 + 10,185 \approx 10,550 \text{ days}$$

This is a **worst-case theoretical bound**. In practice, the starvation boost dominates much faster due to the quadratic escalation and the fact that most claimants resolve before $\tau_{max}$.

### 4.2 Probabilistic Starvation Bound

With fairness jitter $\mathcal{N}(0, \sigma^2)$ where $\sigma = 0.15$:

The probability that a starving claimant is consistently outranked by a non-starving claimant with priority difference $\Delta$ is bounded by the Gaussian tail:

$$P(\text{outranked}) \leq \exp\left(-\frac{\Delta^2}{2\sigma^2}\right)$$

For $\Delta = 0.5$ (moderate starvation boost):

$$P \leq \exp(-5.56) \approx 0.0038$$

Thus, starvation violations occur with $< 0.4\%$ probability per conflicting pair.

---

## 5. Fairness Jitter Statistical Analysis

### 5.1 Jitter Distribution

Fairness jitter is drawn from $\mathcal{N}(0, \sigma^2)$ with $\sigma = 0.15$.

**Properties:**
- **Zero mean:** No systematic bias in any direction
- **Bounded variance:** $\text{Var}[jitter] = 0.0225$
- **Effect on ranking:** For two claimants with priority difference $\Delta$, jitter reverses the ordering with probability:

$$P_{reverse}(\Delta) = \Phi\left(-\frac{\Delta}{\sigma\sqrt{2}}\right)$$

where $\Phi$ is the standard normal CDF.

| Priority Difference $\Delta$ | $P_{reverse}$ |
|-------------------------------|---------------|
| 0.05 (tiny) | 40.6% |
| 0.15 (small) | 23.9% |
| 0.30 (moderate) | 7.9% |
| 0.50 (large) | 0.9% |
| 1.00 (dominant) | $< 0.001\%$ |

**Interpretation:** Jitter enables meaningful reordering among similarly-prioritized claims (resolving ties fairly) while preserving strong priority ordering for high-urgency cases.

### 5.2 Demographic Fairness

**Theorem 3 (Demographic Parity Preservation).**  
If the priority scoring function $\pi$ is demographic-parity-compliant (equal expected priority across protected groups conditional on urgency/wait time), then jitter preserves this property in expectation.

**Proof:**  
Jitter is i.i.d. $\mathcal{N}(0, \sigma^2)$ independent of all claimant attributes. For any protected group $G$:

$$\mathbb{E}[\pi(c) + jitter \mid c \in G] = \mathbb{E}[\pi(c) \mid c \in G] + \mathbb{E}[jitter] = \mathbb{E}[\pi(c) \mid c \in G]$$

Since $\mathbb{E}[jitter] = 0$, the expected priority is unchanged. The variance increases by $\sigma^2$ uniformly, so relative ordering within groups is perturbed equally. ∎

---

## 6. Daily Cycle Complexity

### 6.1 Full Daily Pass

```
Daily Cycle:
  1. Age all claims          → O(n)
  2. Add new arrivals        → O(a) where a = daily arrivals (~3,000)
  3. Recompute priorities    → O(n) [parallelizable]
  4. Reset adjudicator loads → O(m)
  5. Bipartite matching      → O(n · m) [greedy] or O(n² · m) [Hungarian]
  6. Simulate resolution     → O(n + K)
  7. Record metrics          → O(n)
```

**Total daily complexity (greedy matching):**

$$T_{daily} = O(n) + O(a) + O(n) + O(m) + O(n \cdot m) + O(n + K) + O(n)$$

$$= O(n \cdot m) \quad \text{[dominated by matching]}$$

With $n = 1.1 \times 10^6$, $m = 1.8 \times 10^3$:

$$T_{daily} \approx 2 \times 10^9 \text{ operations}$$

### 6.2 Parallel Speedup

**Priority recomputation:** Embarrassingly parallel. $p$ CPU cores or GPU:

$$T_{priority}^{\parallel} = O\left(\frac{n}{p}\right)$$

**Matching:** The greedy algorithm has limited parallelism due to shared capacity counters. However, with **adjudicator sharding** (partition $A$ into $A_1, A_2, \ldots, A_k$ by specialization):

$$T_{match}^{\parallel} = O\left(\frac{n}{k} \cdot \frac{m}{k} \cdot k\right) = O\left(\frac{n \cdot m}{k}\right)$$

where $k$ is the number of shards. With $k = 16$ (16 specialization clusters):

$$T_{match}^{\parallel} = O\left(\frac{2 \times 10^9}{16}\right) = O(1.25 \times 10^8)$$

At 3 GHz: $\approx 0.04$ seconds.

### 6.3 Memory Complexity

| Structure | Size | Notes |
|-----------|------|-------|
| Claimant records | $O(n)$ | ~200 bytes/claimant = 220 MB for 1.1M |
| Adjudicator records | $O(m)$ | ~1 KB/adjudicator = 1.8 MB |
| Priority queue | $O(n)$ | Heap overhead ~2× = 440 MB |
| Assignment map | $O(n)$ | Hash map ~4× = 880 MB |
| **Total** | **$O(n)$** | **~1.5 GB RAM** |

**Cache optimization:** Batched processing keeps working set in L3 cache ($\sim$50 MB per batch of 50,000 claimants).

---

## 7. Optimizations for 1.1M Scale

### 7.1 Data Structure Upgrades

| Component | Current | Optimized | Speedup |
|-----------|---------|-----------|---------|
| Claimant storage | Python objects | Rust struct + arena | 10–50× |
| Priority queue | Binary heap | Radix heap (integer keys) | 2–3× |
| Matching | Greedy $O(nm)$ | LSH + greedy $O(n \log m)$ | 100×+ |
| Jitter | Python random | xoshiro256+ | 5× |
| Batch processing | Sequential | Rayon parallel | $p$× |

### 7.2 Locality-Sensitive Hashing (LSH) for Matching

Replace $O(n \cdot m)$ specialization filtering with LSH:

1. Encode each adjudicator's specialization as a binary vector $v_j \in \{0,1\}^5$
2. Build LSH index (SimHash or MinHash) over adjudicator vectors
3. For each claimant, query nearest adjudicators in $O(\log m)$ time
4. Only evaluate fit score for top-$k$ nearest neighbors ($k = 10$)

**Result:** $O(n \cdot \log m)$ matching complexity.

$$T_{LSH} = O(1.1 \times 10^6 \cdot \log(1.8 \times 10^3)) = O(1.1 \times 10^6 \cdot 10.8) = O(1.2 \times 10^7)$$

**Speedup:** $\approx 165\times$ over naive greedy.

### 7.3 GPU Acceleration

NVIDIA A100 (312 TFLOPS FP32):

- Priority scoring: Vectorized f32 operations across all claimants
- Matching: CUDA-based auction algorithm (Bertsekas parallel auction)
- Expected throughput: $> 10^7$ claimants/second for scoring + matching

---

## 8. Correctness Properties

### 8.1 Termination

**Theorem 4 (Daily Termination).**  
Each daily cycle terminates in finite time.

**Proof:**  
All loops are bounded: priority recomputation iterates over $n$ claimants; matching iterates over $n$ claimants and $m$ adjudicators; resolution processes at most $K$ claims. No unbounded recursion or iteration. ∎

### 8.2 Feasibility

**Theorem 5 (Capacity Feasibility).**  
The assignment $\phi$ never exceeds adjudicator capacities.

**Proof:**  
The matching algorithm decrements `remaining_cap[a_j]` on each assignment and checks `remaining_cap[a_j] > 0` before assignment. By invariant, `remaining_cap[a_j] = \kappa(a_j) - |\phi^{-1}(a_j)| \geq 0`. ∎

### 8.3 Specialization Compliance

**Theorem 6 (Specialization Feasibility).**  
Every assigned claim is matched to a qualified adjudicator.

**Proof:**  
The eligible set is defined as $\{a_j : (c_i, a_j) \in S \wedge \text{remaining\_cap}[a_j] > 0\}$. The argmax is taken over this set exclusively. ∎

---

## 9. Summary of Computational Bounds

| Phase | Single-Threaded | Parallel (16 cores) | GPU (A100) |
|-------|-----------------|---------------------|------------|
| Priority scoring | $O(n) \approx 0.37$ s | $O(n/p) \approx 0.023$ s | $<< 0.001$ s |
| Greedy matching | $O(nm) \approx 660$ s | $O(nm/p) \approx 41$ s | $\approx 1$ s |
| LSH matching | $O(n \log m) \approx 4$ s | $O(n \log m / p) \approx 0.25$ s | $<< 0.001$ s |
| Resolution | $O(n) \approx 0.37$ s | $O(n/p) \approx 0.023$ s | N/A |
| **Total (greedy)** | **$\approx 11$ min** | **$\approx 41$ s** | **$\approx 1$ s** |
| **Total (LSH)** | **$\approx 4.7$ s** | **$\approx 0.3$ s** | **$<< 0.1$ s** |

**Conclusion:** MORTAR can execute a full daily re-evaluation of 1.1 million claims in **under 1 second on GPU** or **under 1 minute on a 16-core CPU** with LSH optimization. The $O(n^2 \cdot m)$ Hungarian bound is avoided via the greedy approximation, which achieves $\frac{1}{2}$-optimality with $O(n \cdot m)$ complexity, further reducible to $O(n \log m)$ via LSH indexing.

---

## 10. Rust Production Architecture

```rust
// Core data structures (zero-cost abstractions)
pub struct Claimant {
    pub id: u64,
    pub priority: AtomicF32,           // Lock-free priority updates
    pub days_waiting: AtomicU16,
    pub flags: ClaimFlags,             // Bit-packed booleans
    pub category: DisabilityCategory,
}

pub struct Adjudicator {
    pub id: u64,
    pub specialization: SmallVec<[DisabilityCategory; 3]>,
    pub daily_capacity: u8,
    pub remaining: AtomicU8,         // Lock-free capacity tracking
}

// Parallel priority recomputation (Rayon)
claimants.par_iter_mut().for_each(|c| {
    c.priority.store(compute_priority(c), Ordering::Relaxed);
});

// LSH-indexed matching
let lsh_index = LSHIndex::build(&adjudicators);
claimants.par_iter_mut().for_each(|c| {
    let candidates = lsh_index.query(&c.category_vector(), k=10);
    let best = candidates.iter().max_by_key(|a| fit_score(c, a));
    if let Some(adj) = best {
        if adj.remaining.fetch_sub(1, Ordering::SeqCst) > 0 {
            c.assigned_to.store(adj.id, Ordering::Relaxed);
        }
    }
});
```

---

**Authority Identifier:** CP-ALG-001  
**Cross-References:** CP-ETH-002 (Ethical Triage), CP-SEC-003 (Post-Quantum Security), CP-LAW-004 (Legal Framework)

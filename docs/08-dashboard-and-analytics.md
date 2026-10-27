# 08 — Dashboard & Analytics

## Dashboard layout
1. **Stat cards row:** Total Doctors, Total Patients, Avg Patients/Doctor, Patients This Month (with % change vs previous month).
2. **Timeline chart (area/line):** patients admitted over time; range toggle 7d / 30d / 90d / 12m; groupBy day/week/month.
3. **Patients per doctor (horizontal bar):** top 10 doctors by patient count.
4. **Conditions distribution (donut):** top conditions + "Other".
5. **Doctors by specialization (bar or donut).**
6. Optional: recent patients list, status breakdown.
Date-based statistics = timeline + this-month/last-month comparison; optional date-range picker applied to all charts.

## Endpoints & pipelines

### GET /analytics/summary
Use `Promise.all` of `Doctor.estimatedDocumentCount()`, `Patient.estimatedDocumentCount()` (or `countDocuments`), and counts for current vs previous month using `admittedAt` range (index-backed).
```json
{ "totalDoctors": 25, "totalPatients": 400, "avgPatientsPerDoctor": 16, "patientsThisMonth": 38, "patientsLastMonth": 31, "monthChangePct": 22.6 }
```

### GET /analytics/patients-per-doctor?limit=10
Option A (fast): `Doctor.find().sort({patientsCount:-1}).limit(n).select('name specialization patientsCount')` using denormalized counter.
Option B (source of truth): 
```js
Patient.aggregate([
  { $group: { _id: '$doctor', count: { $sum: 1 } } },
  { $sort: { count: -1 } }, { $limit: n },
  { $lookup: { from: 'doctors', localField: '_id', foreignField: '_id', pipeline: [{ $project: { name: 1, specialization: 1 } }], as: 'doctor' } },
  { $unwind: '$doctor' },
  { $project: { _id: 0, doctorId: '$_id', name: '$doctor.name', specialization: '$doctor.specialization', count: 1 } }
])
```
Use A for dashboard, B available/verified in tests.

### GET /analytics/timeline?range=30d&groupBy=day
```js
Patient.aggregate([
  { $match: { admittedAt: { $gte: start, $lte: end } } },
  { $group: { _id: { $dateTrunc: { date: '$admittedAt', unit: groupBy } }, count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])
```
**Zero-fill** missing buckets in the service so the chart has continuous x-axis.

### GET /analytics/conditions
`$group` by `condition`, sort desc, `$limit` 6, roll the rest into "Other" in service.

### GET /analytics/specializations
`$group` on `Doctor.specialization`.

## Rules
- Aggregations hit indexed fields; `$match` first; project only needed fields.
- Cache analytics responses in-memory (e.g. `node-cache`, 60s TTL) — mention in README as scalability consideration; invalidate on writes optionally.
- Frontend: Recharts with `ResponsiveContainer`, accessible tooltips, consistent palette from design tokens, legends, loading skeletons, empty state. Charts are `React.memo` + dynamically imported.

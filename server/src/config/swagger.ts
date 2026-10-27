export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Doctor Tracker REST API",
    version: "1.0.0",
    description:
      "Enterprise clinical administration backend API for managing physicians, patient care registries, and aggregated health analytics.",
    contact: {
      name: "Engineering Team",
      email: "admin@doctortracker.com",
    },
  },
  servers: [
    {
      url: "/",
      description: "Current Host Server",
    },
    {
      url: "http://localhost:5000",
      description: "Local Express Backend",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
        description: "JWT access token stored in httpOnly cookie",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "64a1b2c3d4e5f67890123456" },
          name: { type: "string", example: "Dr. Admin" },
          email: { type: "string", example: "admin@doctortracker.com" },
          role: { type: "string", example: "admin" },
        },
      },
      Doctor: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64a1b2c3d4e5f67890123456" },
          name: { type: "string", example: "Dr. Sarah Jenkins" },
          specialization: { type: "string", example: "Cardiology" },
          hospital: { type: "string", example: "Metropolitan General Hospital" },
          phone: { type: "string", example: "+1-555-019-2834" },
          email: { type: "string", example: "sarah.jenkins@hospital.org" },
          patientsCount: { type: "integer", example: 18 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Patient: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64a1b2c3d4e5f67890123499" },
          name: { type: "string", example: "James Wilson" },
          age: { type: "integer", example: 45 },
          gender: { type: "string", enum: ["male", "female", "other"], example: "male" },
          condition: { type: "string", example: "Hypertension" },
          status: { type: "string", enum: ["active", "recovered", "critical"], example: "active" },
          doctor: {
            oneOf: [
              { type: "string", example: "64a1b2c3d4e5f67890123456" },
              { $ref: "#/components/schemas/Doctor" },
            ],
          },
          phone: { type: "string", example: "+1-555-014-9988" },
          email: { type: "string", example: "jwilson@example.com" },
          admittedAt: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PaginationMeta: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          total: { type: "integer", example: 400 },
          totalPages: { type: "integer", example: 40 },
          hasNextPage: { type: "boolean", example: true },
          hasPrevPage: { type: "boolean", example: false },
        },
      },
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "object" },
          meta: { $ref: "#/components/schemas/PaginationMeta" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation Error" },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string", example: "email" },
                message: { type: "string", example: "Invalid email format" },
              },
            },
          },
        },
      },
    },
  },
  security: [{ cookieAuth: [] }],
  paths: {
    "/health": {
      get: {
        summary: "Uptime Health Check",
        description: "Returns server uptime status and current UTC ISO timestamp.",
        security: [],
        responses: {
          200: {
            description: "Service is operational",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        summary: "Admin Authentication",
        description: "Authenticates admin credentials, sets an httpOnly session cookie, and returns user details.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "admin@doctortracker.com" },
                  password: { type: "string", example: "Admin@12345" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/v1/auth/logout": {
      post: {
        summary: "Sign Out",
        description: "Clears the authentication httpOnly cookie.",
        responses: {
          200: {
            description: "Session terminated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Logged out successfully" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/me": {
      get: {
        summary: "Current User Profile",
        description: "Fetches currently authenticated administrator profile from session cookie.",
        responses: {
          200: {
            description: "Current active session",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized session",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/v1/doctors": {
      get: {
        summary: "List Doctors",
        description: "Paginated list of physicians with regex-escaped prefix search, compound index filtering, and sorting.",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "search", in: "query", schema: { type: "string" }, description: "Search by name prefix, email, or phone" },
          { name: "specialization", in: "query", schema: { type: "string" } },
          { name: "hospital", in: "query", schema: { type: "string" } },
          { name: "sortBy", in: "query", schema: { type: "string", enum: ["createdAt", "name", "patientsCount"], default: "createdAt" } },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "desc" } },
        ],
        responses: {
          200: {
            description: "Paginated doctor records",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Doctor" } },
                    meta: { $ref: "#/components/schemas/PaginationMeta" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Register Physician",
        description: "Creates a new certified physician record. Enforces unique email constraint.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "specialization", "hospital", "phone", "email"],
                properties: {
                  name: { type: "string", example: "Dr. Alexander Wright" },
                  specialization: { type: "string", example: "Neurology" },
                  hospital: { type: "string", example: "Memorial Healthcare Center" },
                  phone: { type: "string", example: "+1-555-018-2993" },
                  email: { type: "string", example: "alexander.wright@hospital.org" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Physician registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Doctor" },
                  },
                },
              },
            },
          },
          409: {
            description: "Email already registered",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/v1/doctors/filters": {
      get: {
        summary: "Doctor Filter Options",
        description: "Returns distinct specializations and hospital values for dropdowns.",
        responses: {
          200: {
            description: "Available filter arrays",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        specializations: { type: "array", items: { type: "string" } },
                        hospitals: { type: "array", items: { type: "string" } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/doctors/{id}": {
      get: {
        summary: "Get Doctor by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Doctor" },
                  },
                },
              },
            },
          },
          404: {
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
      patch: {
        summary: "Update Doctor",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  specialization: { type: "string" },
                  hospital: { type: "string" },
                  phone: { type: "string" },
                  email: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Doctor" },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete Doctor",
        description: "Deletes a physician. Blocked if active patients are assigned unless cascade=true.",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "cascade", in: "query", schema: { type: "boolean", default: false } },
        ],
        responses: {
          200: {
            description: "Physician deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Doctor deleted successfully" },
                  },
                },
              },
            },
          },
          409: {
            description: "Referential integrity conflict: doctor has patients",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/v1/doctors/{id}/patients": {
      get: {
        summary: "List Patients Under Doctor",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Patient" } },
                    meta: { $ref: "#/components/schemas/PaginationMeta" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Add Patient Directly Under Doctor",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "age", "gender", "condition", "phone", "email"],
                properties: {
                  name: { type: "string", example: "Emily Davis" },
                  age: { type: "integer", example: 34 },
                  gender: { type: "string", enum: ["male", "female", "other"], example: "female" },
                  condition: { type: "string", example: "Asthma" },
                  status: { type: "string", enum: ["active", "recovered", "critical"], default: "active" },
                  phone: { type: "string", example: "+1-555-019-3344" },
                  email: { type: "string", example: "emily.davis@example.com" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Patient" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/patients": {
      get: {
        summary: "List Patients",
        description: "Paginated patient records with populated physician details and filters.",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "condition", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["active", "recovered", "critical"] } },
          { name: "gender", in: "query", schema: { type: "string", enum: ["male", "female", "other"] } },
          { name: "doctor", in: "query", schema: { type: "string" } },
          { name: "sortBy", in: "query", schema: { type: "string", enum: ["admittedAt", "name", "age"], default: "admittedAt" } },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "desc" } },
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Patient" } },
                    meta: { $ref: "#/components/schemas/PaginationMeta" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Register Patient",
        description: "Creates patient record and atomically increments doctor's patientsCount.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "age", "gender", "condition", "doctor", "phone", "email"],
                properties: {
                  name: { type: "string", example: "Robert Brown" },
                  age: { type: "integer", example: 52 },
                  gender: { type: "string", enum: ["male", "female", "other"], example: "male" },
                  condition: { type: "string", example: "Diabetes Type 2" },
                  status: { type: "string", enum: ["active", "recovered", "critical"], default: "active" },
                  doctor: { type: "string", example: "64a1b2c3d4e5f67890123456" },
                  phone: { type: "string", example: "+1-555-017-4488" },
                  email: { type: "string", example: "rbrown@example.com" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Patient" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/patients/filters": {
      get: {
        summary: "Patient Filter Options",
        description: "Returns distinct conditions, statuses, and genders.",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        conditions: { type: "array", items: { type: "string" } },
                        statuses: { type: "array", items: { type: "string" } },
                        genders: { type: "array", items: { type: "string" } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/patients/{id}": {
      get: {
        summary: "Get Patient by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Patient" },
                  },
                },
              },
            },
          },
        },
      },
      patch: {
        summary: "Update Patient",
        description: "Updates patient record. Automatically balances doctor patientsCount counters if doctor is reassigned.",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Patient" } } },
        },
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Patient" },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete Patient",
        description: "Deletes patient record and atomically decrements assigned doctor's patientsCount.",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Patient deleted successfully" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/analytics/summary": {
      get: {
        summary: "Executive KPI Summary",
        description: "Calculates total active physicians, total admitted patients, and 30-day percentage trend.",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        totalDoctors: { type: "integer", example: 25 },
                        totalPatients: { type: "integer", example: 400 },
                        monthChangePct: { type: "number", example: 12.5 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/analytics/patients-per-doctor": {
      get: {
        summary: "Top Physicians by Patient Load",
        parameters: [{ name: "limit", in: "query", schema: { type: "integer", default: 10 } }],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          _id: { type: "string" },
                          name: { type: "string" },
                          specialization: { type: "string" },
                          patientsCount: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/analytics/timeline": {
      get: {
        summary: "Continuous Zero-Filled Admissions Timeline",
        parameters: [
          {
            name: "range",
            in: "query",
            schema: { type: "string", enum: ["7d", "30d", "90d", "12m"], default: "30d" },
          },
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          date: { type: "string", example: "2026-10-25" },
                          count: { type: "integer", example: 14 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/analytics/conditions": {
      get: {
        summary: "Condition Breakdown Distribution",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          condition: { type: "string", example: "Hypertension" },
                          count: { type: "integer", example: 86 },
                          percentage: { type: "number", example: 21.5 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/analytics/specializations": {
      get: {
        summary: "Department Specialization Statistics",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          specialization: { type: "string", example: "Cardiology" },
                          count: { type: "integer", example: 6 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

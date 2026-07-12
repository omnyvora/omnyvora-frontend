// Central registry of all services and their API base URLs.
// Rule: every service API module reads its base URL from here — never hardcodes a URL.
//
// To add a new service: add one entry here. Nothing else changes globally.

const ROOT_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const serviceEntries = {
  auth:          { baseUrl: null as string | null, version: "v1" },
  otp:           { baseUrl: null as string | null, version: "v1" },
  profiles:      { baseUrl: null as string | null, version: "v1" },
  notifications: { baseUrl: null as string | null, version: "v1" },
  catalog:       { baseUrl: null as string | null, version: "v1" },
  activity:      { baseUrl: null as string | null, version: "v1" },
  logs:          { baseUrl: null as string | null, version: "v1" },
  admin:         { baseUrl: null as string | null, version: "v1" },
  // Future services with their own domains:
  // cvBuilder: { baseUrl: process.env.NEXT_PUBLIC_CV_BUILDER_API_URL ?? null, version: "v1" },
};

export const serviceRegistry = {
  rootUrl: ROOT_URL,
  services: serviceEntries,
};

export type ServiceName = keyof typeof serviceEntries;

// Resolves the versioned base URL for a service.
// Falls back to rootUrl when the service has no dedicated domain.
export function resolveServiceUrl(service: ServiceName): string {
  const entry = serviceRegistry.services[service];
  return `${entry.baseUrl ?? ROOT_URL}/${entry.version}`;
}

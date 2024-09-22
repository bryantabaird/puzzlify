"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

export default function AdventureBreadCrumb({
  adventure,
}: {
  adventure: { name: string };
}) {
  const pathName = usePathname();
  const pathSegments = pathName.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    let href = `/${pathSegments.slice(0, index + 1).join("/")}`;

    if (index === 1) {
      return { label: adventure.name, href };
    }

    return { label: segment.charAt(0).toUpperCase() + segment.slice(1), href };
  });

  if (breadcrumbs.length === 1) {
    return undefined;
  }

  return (
    <Breadcrumb className="py-4">
      <BreadcrumbList>
        {breadcrumbs.map(({ label, href }, index) => {
          const isLastBreadcrumb = index === breadcrumbs.length - 1;
          return (
            <React.Fragment key={href}>
              {isLastBreadcrumb ? (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              ) : (
                // Add a separator if this isn't the last breadcrumb
                <>
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
            </React.Fragment>
          );
        })}
        {/* <BreadcrumbItem>
          <BreadcrumbLink href={`/adventure/${'hi'}`}>
            {adventure.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem> */}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

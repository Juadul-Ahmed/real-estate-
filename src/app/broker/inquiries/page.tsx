"use client";

import { InquiryList } from "@/components/inquiry-list";
import { RoleGuard } from "@/lib/role-guard";

function BrokerInquiries() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 bg-canvas text-title">
      <h1 className="text-2xl font-bold mb-6">Inquiries & Messages</h1>
      <InquiryList role="broker" />
    </div>
  );
}

export default function Page() {
  return <RoleGuard roles={["broker"]}><BrokerInquiries /></RoleGuard>;
}

"use client";

import { useQueryClient } from "@tanstack/react-query";
import { FileUploader } from "@/components/files/file-uploader";
import { FileVaultTable } from "@/components/files/file-vault-table";
import { Card } from "@/components/ui/card";

export default function FilesPage() {
  const queryClient = useQueryClient();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">My Files</h1>
        <p className="text-sm text-brand-textSecondary">
          Upload, organize, and manage your documents
        </p>
      </div>

      <Card>
        <FileUploader
          onUploaded={() =>
            queryClient.invalidateQueries({ queryKey: ["files"] })
          }
        />
      </Card>

      <FileVaultTable />
    </div>
  );
}

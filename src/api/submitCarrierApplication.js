import { supabase } from "../lib/supabase";

/**
 * Handles the full submission workflow:
 * 1. Uploads files to storage
 * 2. Inserts application record
 */
export async function submitCarrierApplication(formData, files) {
    try {
        const carrierId = crypto.randomUUID(); // Unique folder ID
        const fileUrls = {};

        // 1. Upload Files
        for (const [key, file] of Object.entries(files)) {
            if (!file) continue;

            const fileExt = file.name.split('.').pop();
            const fileName = `${key}.${fileExt}`;
            const filePath = `carrier_docs/${carrierId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('carrier_docs')
                .upload(filePath, file);

            if (uploadError) throw new Error(`Upload failed for ${key}: ${uploadError.message}`);

            const { data: urlData } = supabase.storage
                .from('carrier_docs')
                .getPublicUrl(filePath);

            fileUrls[`${key}_url`] = urlData.publicUrl;
        }

        // 2. Insert into DB — NO extra fake columns
        const { error: dbError } = await supabase
            .from('carrier_applications')
            .insert([
                {
                    id: carrierId,
                    ...formData,
                    ...fileUrls
                    // ❌ NO compliance_certified
                    // ❌ NO compliance_agreement
                    // Only columns defined in the SQL table!
                }
            ]);

        if (dbError) throw new Error(`Database insert failed: ${dbError.message}`);

        return { success: true };

    } catch (error) {
        console.error("Submission Error:", error);
        return { success: false, message: error.message };
    }
}


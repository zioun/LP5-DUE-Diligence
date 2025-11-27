Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { fullName, email, phone, company, message } = await req.json();

        // Validate required parameters
        if (!fullName || !email) {
            throw new Error('Full name and email are required');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Please enter a valid email address');
        }

        // Get environment variables
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        console.log('Processing facility tour request:', { email, company });

        // Insert into database
        const insertResponse = await fetch(`${supabaseUrl}/rest/v1/facility_tour_requests`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                full_name: fullName,
                email: email,
                phone: phone || null,
                company: company || null,
                message: message || null,
                status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
        });

        if (!insertResponse.ok) {
            const errorText = await insertResponse.text();
            console.error('Database insert failed:', errorText);
            throw new Error(`Database insert failed: ${errorText}`);
        }

        const requestData = await insertResponse.json();
        console.log('Facility tour request created successfully:', requestData[0]?.id);

        return new Response(JSON.stringify({
            data: {
                success: true,
                message: 'Facility tour request submitted successfully! We will contact you within 24 hours.',
                requestId: requestData[0]?.id
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Facility tour request error:', error);

        const errorResponse = {
            error: {
                code: 'FACILITY_TOUR_REQUEST_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

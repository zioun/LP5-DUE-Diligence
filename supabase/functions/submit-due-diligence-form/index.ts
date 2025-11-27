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
        const { fullName, email, phone, country, investmentSize } = await req.json();

        // Validate required parameters
        if (!fullName || !email || !country || !investmentSize) {
            throw new Error('Full name, email, country, and investment size are required');
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

        console.log('Processing due diligence form submission:', { email, country, investmentSize });

        // Insert into database
        const insertResponse = await fetch(`${supabaseUrl}/rest/v1/due_diligence_leads`, {
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
                country: country,
                investment_size: investmentSize,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
        });

        if (!insertResponse.ok) {
            const errorText = await insertResponse.text();
            console.error('Database insert failed:', errorText);
            throw new Error(`Database insert failed: ${errorText}`);
        }

        const leadData = await insertResponse.json();
        console.log('Due diligence lead created successfully:', leadData[0]?.id);

        return new Response(JSON.stringify({
            data: {
                success: true,
                message: 'Due diligence form submitted successfully! Check your email for the toolkit download.',
                leadId: leadData[0]?.id
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Due diligence form submission error:', error);

        const errorResponse = {
            error: {
                code: 'FORM_SUBMISSION_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

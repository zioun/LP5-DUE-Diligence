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
        const { email } = await req.json();

        // Validate required parameters
        if (!email) {
            throw new Error('Email is required');
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

        console.log('Processing newsletter subscription:', { email });

        // Check if email already exists
        const checkResponse = await fetch(`${supabaseUrl}/rest/v1/newsletter_subscribers?email=eq.${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!checkResponse.ok) {
            const errorText = await checkResponse.text();
            console.error('Database check failed:', errorText);
            throw new Error('Database check failed');
        }

        const existingSubscribers = await checkResponse.json();
        
        if (existingSubscribers.length > 0) {
            // Email already exists, update status to active if needed
            const updateResponse = await fetch(`${supabaseUrl}/rest/v1/newsletter_subscribers?email=eq.${encodeURIComponent(email)}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'active',
                    updated_at: new Date().toISOString()
                })
            });

            if (!updateResponse.ok) {
                const errorText = await updateResponse.text();
                console.error('Database update failed:', errorText);
                throw new Error('Database update failed');
            }

            console.log('Newsletter subscription updated successfully:', email);

            return new Response(JSON.stringify({
                data: {
                    success: true,
                    message: 'Successfully subscribed to the Intelligence Brief! (Email already registered)'
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        } else {
            // Insert new subscription
            const insertResponse = await fetch(`${supabaseUrl}/rest/v1/newsletter_subscribers`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    email: email,
                    status: 'active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
            });

            if (!insertResponse.ok) {
                const errorText = await insertResponse.text();
                console.error('Database insert failed:', errorText);
                throw new Error(`Database insert failed: ${errorText}`);
            }

            const subscriberData = await insertResponse.json();
            console.log('Newsletter subscription created successfully:', subscriberData[0]?.id);

            return new Response(JSON.stringify({
                data: {
                    success: true,
                    message: 'Successfully subscribed to the Intelligence Brief!',
                    subscriberId: subscriberData[0]?.id
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

    } catch (error) {
        console.error('Newsletter subscription error:', error);

        const errorResponse = {
            error: {
                code: 'NEWSLETTER_SUBSCRIPTION_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

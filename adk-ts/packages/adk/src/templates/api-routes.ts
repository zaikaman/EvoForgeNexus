/**
 * API Route Templates
 * Templates for generating Next.js API routes
 */

/**
 * Generate a simple GET API route
 */
export function generateGetRoute(resourceName: string): string {
	return `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch ${resourceName} from database
    const data = [];
    
    return NextResponse.json({ 
      success: true, 
      data 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ${resourceName}' },
      { status: 500 }
    );
  }
}
`;
}

/**
 * Generate a POST API route
 */
export function generatePostRoute(resourceName: string): string {
	return `import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Validate input
    // TODO: Save ${resourceName} to database
    
    return NextResponse.json({ 
      success: true, 
      message: '${resourceName} created successfully',
      data: body
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create ${resourceName}' },
      { status: 500 }
    );
  }
}
`;
}

/**
 * Generate a full CRUD API route
 */
export function generateCrudRoute(resourceName: string): string {
	return `import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all ${resourceName}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // TODO: Fetch ${resourceName} from database with pagination
    const data = [];
    const total = 0;
    
    return NextResponse.json({ 
      success: true, 
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ${resourceName}' },
      { status: 500 }
    );
  }
}

// POST - Create new ${resourceName}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Validate input
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }
    
    // TODO: Save to database
    const created = { id: Date.now(), ...body };
    
    return NextResponse.json({ 
      success: true, 
      message: '${resourceName} created successfully',
      data: created
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create ${resourceName}' },
      { status: 500 }
    );
  }
}

// PUT - Update ${resourceName}
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }
    
    // TODO: Update in database
    const updated = { id, ...updates };
    
    return NextResponse.json({ 
      success: true, 
      message: '${resourceName} updated successfully',
      data: updated
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update ${resourceName}' },
      { status: 500 }
    );
  }
}

// DELETE - Remove ${resourceName}
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }
    
    // TODO: Delete from database
    
    return NextResponse.json({ 
      success: true, 
      message: '${resourceName} deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete ${resourceName}' },
      { status: 500 }
    );
  }
}
`;
}

/**
 * Generate a webhook handler route
 */
export function generateWebhookRoute(serviceName: string): string {
	return `import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-${serviceName.toLowerCase()}-signature');
    
    // Verify webhook signature
    const secret = process.env.${serviceName.toUpperCase()}_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error('Webhook secret not configured');
    }
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Parse and process webhook
    const data = JSON.parse(body);
    
    // TODO: Handle webhook event
    console.log('${serviceName} webhook received:', data);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed' 
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
`;
}

/**
 * Generate authentication middleware
 */
export function generateAuthMiddleware(): string {
	return `import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  try {
    // TODO: Verify JWT token
    // const decoded = verifyToken(token);
    
    // Add user info to headers
    const response = NextResponse.next();
    // response.headers.set('x-user-id', decoded.userId);
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
};
`;
}

/**
 * Generate file upload route
 */
export function generateUploadRoute(): string {
	return `import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large' },
        { status: 400 }
      );
    }
    
    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filename = \`\${Date.now()}-\${file.name}\`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(filepath, buffer);
    
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename,
        url: \`/uploads/\${filename}\`,
        size: file.size,
        type: file.type
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
`;
}

/**
 * API template registry
 */
export const apiTemplates = {
	get: generateGetRoute,
	post: generatePostRoute,
	crud: generateCrudRoute,
	webhook: generateWebhookRoute,
	upload: generateUploadRoute,
	auth: () => generateAuthMiddleware(),
};

/**
 * Get API template by type
 */
export function getApiTemplate(
	type: keyof typeof apiTemplates,
	resourceName = "resource",
): string {
	const generator = apiTemplates[type];
	if (type === "auth") {
		return (generator as () => string)();
	}
	return (generator as (name: string) => string)(resourceName);
}

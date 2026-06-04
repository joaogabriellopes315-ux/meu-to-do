"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SupabaseTest() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: supabaseData, error: supabaseError } = await supabase
        .from('your_table_name')
        .select('*');
      
      if (supabaseError) throw supabaseError;
      setData(supabaseData || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Test</CardTitle>
        <CardDescription>Test your Supabase connection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={fetchData} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Data'}
        </Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {data.length > 0 && (
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react'

interface Program {
  id: string;
  title: string;
  description: string;
  languagePrimary: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
  topics: { name: string }[];
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [languageFilter, setLanguageFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Mock data for demonstration
  useEffect(() => {
    const mockPrograms: Program[] = [
      {
        id: '1',
        title: 'Advanced Mathematics',
        description: 'A comprehensive program covering advanced mathematical concepts',
        languagePrimary: 'en',
        status: 'published',
        publishedAt: '2023-10-15T10:30:00Z',
        createdAt: '2023-10-10T09:15:00Z',
        topics: [{ name: 'Mathematics' }]
      },
      {
        id: '2',
        title: 'Basic Science',
        description: 'An introductory program to basic science concepts',
        languagePrimary: 'te',
        status: 'draft',
        createdAt: '2023-10-12T14:20:00Z',
        topics: [{ name: 'Science' }]
      }
    ]
    setPrograms(mockPrograms)
    setFilteredPrograms(mockPrograms)
  }, [])

  // Apply filters
  useEffect(() => {
    let result = programs

    if (statusFilter !== 'all') {
      result = result.filter(program => program.status === statusFilter)
    }

    if (languageFilter !== 'all') {
      result = result.filter(program => program.languagePrimary === languageFilter)
    }

    if (searchTerm) {
      result = result.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredPrograms(result)
  }, [statusFilter, languageFilter, searchTerm, programs])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
          <p className="text-muted-foreground">Manage educational programs</p>
        </div>
        <Button asChild>
          <Link href="/programs/new">
            <Plus className="h-4 w-4 mr-2" />
            New Program
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search programs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="te">Telugu</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Primary Language</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Topics</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrograms.map((program) => (
                <TableRow key={program.id}>
                  <TableCell className="font-medium">{program.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{program.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{program.languagePrimary.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        program.status === 'published' ? 'default' :
                        program.status === 'draft' ? 'secondary' :
                        'destructive'
                      }
                    >
                      {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {program.topics.map(topic => (
                      <Badge key={topic.name} variant="outline" className="mr-1">
                        {topic.name}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    {new Date(program.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/programs/${program.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/programs/${program.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
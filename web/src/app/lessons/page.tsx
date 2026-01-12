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
import { Plus, Search, Eye, Edit, Trash2, Play, FileText } from 'lucide-react'

interface Lesson {
  id: string;
  title: string;
  lessonNumber: number;
  termId: string;
  contentType: string;
  durationMs?: number;
  isPaid: boolean;
  status: string;
  publishAt?: string;
  publishedAt?: string;
  createdAt: string;
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Mock data for demonstration
  useEffect(() => {
    const mockLessons: Lesson[] = [
      {
        id: '1',
        title: 'Introduction to Algebra',
        lessonNumber: 1,
        termId: '1',
        contentType: 'video',
        durationMs: 1800000, // 30 minutes
        isPaid: false,
        status: 'published',
        publishedAt: '2023-10-15T10:30:00Z',
        createdAt: '2023-10-10T09:15:00Z'
      },
      {
        id: '2',
        title: 'Linear Equations',
        lessonNumber: 2,
        termId: '1',
        contentType: 'article',
        isPaid: true,
        status: 'published',
        publishedAt: '2023-10-16T14:20:00Z',
        createdAt: '2023-10-12T14:20:00Z'
      },
      {
        id: '3',
        title: 'Quadratic Equations',
        lessonNumber: 3,
        termId: '1',
        contentType: 'video',
        durationMs: 2400000, // 40 minutes
        isPaid: true,
        status: 'scheduled',
        publishAt: new Date(Date.now() + 2 * 60000).toISOString(), // 2 minutes from now
        createdAt: '2023-10-14T11:30:00Z'
      },
      {
        id: '4',
        title: 'Limits and Continuity',
        lessonNumber: 1,
        termId: '2',
        contentType: 'video',
        durationMs: 3000000, // 50 minutes
        isPaid: true,
        status: 'draft',
        createdAt: '2023-10-15T16:45:00Z'
      }
    ]
    setLessons(mockLessons)
    setFilteredLessons(mockLessons)
  }, [])

  // Apply filters
  useEffect(() => {
    let result = lessons

    if (statusFilter !== 'all') {
      result = result.filter(lesson => lesson.status === statusFilter)
    }

    if (contentTypeFilter !== 'all') {
      result = result.filter(lesson => lesson.contentType === contentTypeFilter)
    }

    if (searchTerm) {
      result = result.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLessons(result)
  }, [statusFilter, contentTypeFilter, searchTerm, lessons])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lessons</h1>
          <p className="text-muted-foreground">Manage lesson content</p>
        </div>
        <Button asChild>
          <Link href="/lessons/new">
            <Plus className="h-4 w-4 mr-2" />
            New Lesson
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
                  placeholder="Search lessons..."
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
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="article">Article</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Publish At</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell className="font-medium">{lesson.lessonNumber}</TableCell>
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>
                    {lesson.contentType === 'video' ? (
                      <div className="flex items-center">
                        <Play className="h-4 w-4 mr-1" />
                        Video
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        Article
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {lesson.durationMs ? `${Math.round(lesson.durationMs / 60000)} min` : '-'}
                  </TableCell>
                  <TableCell>
                    {lesson.isPaid ? (
                      <Badge variant="default">Paid</Badge>
                    ) : (
                      <Badge variant="outline">Free</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        lesson.status === 'published' ? 'default' :
                        lesson.status === 'scheduled' ? 'secondary' :
                        lesson.status === 'draft' ? 'outline' :
                        'destructive'
                      }
                    >
                      {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {lesson.publishAt ? new Date(lesson.publishAt).toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/lessons/${lesson.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/lessons/${lesson.id}/edit`}>
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
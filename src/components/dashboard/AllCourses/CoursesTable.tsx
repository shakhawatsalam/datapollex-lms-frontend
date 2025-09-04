"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/course/courseApi";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

// Define columns for the data table
const columns = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }: { row: any }) => `$${row.price.toFixed(2)}`,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }: { row: any }) => (
      <div className='max-w-xs truncate'>{row.description}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, deleteCourse }: { row: any; deleteCourse: any }) => (
      <div className='flex gap-2'>
        <Button
          asChild
          className={cn(
            "bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white hover:from-[#2D7F74] hover:to-[#3DB6A6] rounded-full"
          )}>
          <Link href={`edit-course/${row._id}`}>
            <Edit className='h-4 w-4 mr-2' /> Edit
          </Link>
        </Button>
        <Button
          variant='destructive'
          className='bg-red-500 hover:bg-red-600 rounded-full'
          onClick={() => deleteCourse(row._id)}>
          <Trash2 className='h-4 w-4 mr-2' /> Delete
        </Button>
      </div>
    ),
  },
];

const CoursesTable = () => {
  const { data: coursesData, isLoading, error } = useGetAllCoursesQuery();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (courseId: string) => {
    setDeletingId(courseId);
    try {
      await deleteCourse(courseId).unwrap();
      toast("Course deleted successfully");
    } catch (err) {
      toast("Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-gray-600'>Loading courses...</p>
      </div>
    );
  }

  if (error || !coursesData?.data) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-red-500'>Error loading courses</p>
      </div>
    );
  }

  return (
    <section className='py-12 md:py-20 w-full bg-white relative min-h-screen'>
      {/* Teal Glow Background */}
      <div
        className='absolute inset-0 z-0'
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #14b8a6 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative'>
        <div className='mb-8'>
          <h1
            className={cn(
              "text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#00564A] to-[#00A892] bg-clip-text text-transparent"
            )}>
            All Courses
          </h1>
        </div>
        <div className='rounded-lg border border-[#3DB6A6] bg-white shadow-lg'>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.id || column.accessorKey}
                    className='text-gray-600 font-semibold'>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {coursesData.data.map((course: any) => (
                <TableRow key={course._id}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id || column.accessorKey}
                      className='text-gray-600'>
                      {column.cell
                        ? column.cell({
                            row: course,
                            deleteCourse: () => handleDelete(course._id),
                          })
                        : course[column.accessorKey as keyof typeof course]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default CoursesTable;

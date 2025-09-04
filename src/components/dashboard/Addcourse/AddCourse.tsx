"use client";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useCreateCourseMutation } from "@/redux/features/course/courseApi";
import { toast } from "sonner";

// Define validation schema with Zod
const lectureSchema = z.object({
  title: z.string().min(1, "Lecture title is required"),
  videoUrl: z.string().url("Invalid video URL"),
  pdfNotes: z.array(
    z.object({
      public_id: z.string().min(1, "PDF public ID is required"),
      url: z.string().url("Invalid PDF URL"),
    })
  ),
});

const moduleSchema = z.object({
  title: z.string().min(1, "Module title is required"),
  moduleNumber: z.number().min(1, "Module number must be at least 1"),
  lectures: z.array(lectureSchema),
});

const courseSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  description: z.string().min(1, "Course description is required"),
  price: z.number().min(0, "Price cannot be negative"),
  thumbnail: z.object({
    public_id: z.string().min(1, "Thumbnail public ID is required"),
    url: z.string().url("Invalid thumbnail URL"),
  }),
  modules: z.array(moduleSchema),
});

// Infer form type from schema
type CourseFormData = z.infer<typeof courseSchema>;

const AddCourse = () => {
  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      thumbnail: { public_id: "", url: "" },
      modules: [],
    },
  });

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({
    control,
    name: "modules",
  });

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    try {
      await createCourse(data).unwrap();
      toast("Course created successfully");
      reset();
    } catch (error) {
      toast("Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='py-12 md:py-20 w-full bg-white relative min-h-screen' >
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
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative' >
        <Card className='bg-white shadow-lg rounded-lg'>
          <CardHeader>
            <CardTitle
              className={cn(
                "text-3xl font-bold bg-gradient-to-r from-[#00564A] to-[#00A892] bg-clip-text text-transparent"
              )}>
              Create a New Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              {/* Course Title */}
              <div className='space-y-2'>
                <Label htmlFor='title' className='text-gray-600'>
                  Course Title
                </Label>
                <Controller
                  name='title'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='title'
                      placeholder='Enter course title'
                      className='border-[#3DB6A6] focus:ring-[#3DB6A6]'
                    />
                  )}
                />
                {errors.title && (
                  <p className='text-red-500 text-sm'>{errors.title.message}</p>
                )}
              </div>

              {/* Course Description */}
              <div className='space-y-2'>
                <Label htmlFor='description' className='text-gray-600'>
                  Description
                </Label>
                <Controller
                  name='description'
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id='description'
                      placeholder='Enter course description'
                      className='border-[#3DB6A6] focus:ring-[#3DB6A6]'
                    />
                  )}
                />
                {errors.description && (
                  <p className='text-red-500 text-sm'>
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Course Price */}
              <div className='space-y-2'>
                <Label htmlFor='price' className='text-gray-600'>
                  Price
                </Label>
                <Controller
                  name='price'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='price'
                      type='number'
                      placeholder='Enter course price'
                      className='border-[#3DB6A6] focus:ring-[#3DB6A6]'
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  )}
                />
                {errors.price && (
                  <p className='text-red-500 text-sm'>{errors.price.message}</p>
                )}
              </div>

              {/* Thumbnail */}
              <div className='space-y-2'>
                <Label className='text-gray-600'>Thumbnail</Label>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <Controller
                      name='thumbnail.public_id'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder='Thumbnail Public ID'
                          className='border-[#3DB6A6] focus:ring-[#3DB6A6]'
                        />
                      )}
                    />
                    {errors.thumbnail?.public_id && (
                      <p className='text-red-500 text-sm'>
                        {errors.thumbnail.public_id.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Controller
                      name='thumbnail.url'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder='Thumbnail URL'
                          className='border-[#3DB6A6] focus:ring-[#3DB6A6]'
                        />
                      )}
                    />
                    {errors.thumbnail?.url && (
                      <p className='text-red-500 text-sm'>
                        {errors.thumbnail.url.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modules */}
              <div className='space-y-4'>
                <Label className='text-gray-600'>Modules</Label>
                {moduleFields.map((module, moduleIndex) => (
                  <Card key={module.id} className='border-[#3DB6A6] bg-gray-50'>
                    <CardContent className='pt-6'>
                      <div className='flex justify-between items-center mb-4'>
                        <h3 className='text-lg font-semibold text-[#00564A]'>
                          Module {moduleIndex + 1}
                        </h3>
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() => removeModule(moduleIndex)}
                          className='bg-red-500 hover:bg-red-600'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                      {/* Module Title */}
                      <div className='space-y-2'>
                        <Controller
                          name={`modules.${moduleIndex}.title`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder='Module Title'
                              className='border-[#3DB6A6] focus:ring-[#3DB6A6]'
                            />
                          )}
                        />
                        {errors.modules?.[moduleIndex]?.title && (
                          <p className='text-red-500 text-sm'>
                            {errors.modules[moduleIndex].title?.message}
                          </p>
                        )}
                      </div>
                      {/* Module Number */}
                      <div className='space-y-2 mt-4'>
                        <Controller
                          name={`modules.${moduleIndex}.moduleNumber`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type='number'
                              placeholder='Module Number'
                              className='border-[#3DB6A6] focus:ring-[#3DB6A6]'
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          )}
                        />
                        {errors.modules?.[moduleIndex]?.moduleNumber && (
                          <p className='text-red-500 text-sm'>
                            {errors.modules[moduleIndex].moduleNumber?.message}
                          </p>
                        )}
                      </div>
                      {/* Lectures */}
                      <LectureFields
                        control={control}
                        moduleIndex={moduleIndex}
                        errors={errors}
                      />
                    </CardContent>
                  </Card>
                ))}
                <Button
                  type='button'
                  onClick={() =>
                    appendModule({
                      title: "",
                      moduleNumber: moduleFields.length + 1,
                      lectures: [],
                    })
                  }
                  className={cn(
                    "bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white hover:from-[#2D7F74] hover:to-[#3DB6A6] rounded-full"
                  )}>
                  <Plus className='h-4 w-4 mr-2' /> Add Module
                </Button>
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                disabled={isSubmitting || isLoading}
                className={cn(
                  "w-full bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white hover:from-[#2D7F74] hover:to-[#3DB6A6] rounded-full"
                )}>
                {isSubmitting || isLoading ? "Creating..." : "Create Course"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

// Component to handle lecture fields
const LectureFields = ({
  control,
  moduleIndex,
  errors,
}: {
  control: any;
  moduleIndex: number;
  errors: any;
}) => {
  const {
    fields: lectureFields,
    append: appendLecture,
    remove: removeLecture,
  } = useFieldArray({
    control,
    name: `modules.${moduleIndex}.lectures`,
  });

  return (
    <div className='space-y-4 mt-4'>
      <Label className='text-gray-600'>Lectures</Label>
      {lectureFields.map((lecture, lectureIndex) => (
        <Card key={lecture.id} className='border-[#3DB6A6] bg-gray-50'>
          <CardContent className='pt-6'>
            <div className='flex justify-between items-center mb-4'>
              <h4 className='text-md font-semibold text-[#00564A]'>
                Lecture {lectureIndex + 1}
              </h4>
              <Button
                variant='destructive'
                size='sm'
                onClick={() => removeLecture(lectureIndex)}
                className='bg-red-500 hover:bg-red-600'>
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
            {/* Lecture Title */}
            <div className='space-y-2'>
              <Controller
                name={`modules.${moduleIndex}.lectures.${lectureIndex}.title`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder='Lecture Title'
                    className='border-[#3DB6A6] focus:ring-[#3DB6A6]'
                  />
                )}
              />
              {errors.modules?.[moduleIndex]?.lectures?.[lectureIndex]
                ?.title && (
                <p className='text-red-500 text-sm'>
                  {
                    errors.modules[moduleIndex].lectures[lectureIndex].title
                      .message
                  }
                </p>
              )}
            </div>
            {/* Lecture Video URL */}
            <div className='space-y-2 mt-4'>
              <Controller
                name={`modules.${moduleIndex}.lectures.${lectureIndex}.videoUrl`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder='Video URL'
                    className='border-[#3DB6A6] focus:ring-[#3DB6A6]'
                  />
                )}
              />
              {errors.modules?.[moduleIndex]?.lectures?.[lectureIndex]
                ?.videoUrl && (
                <p className='text-red-500 text-sm'>
                  {
                    errors.modules[moduleIndex].lectures[lectureIndex].videoUrl
                      .message
                  }
                </p>
              )}
            </div>
            {/* PDF Notes */}
            <PdfNotesFields
              control={control}
              moduleIndex={moduleIndex}
              lectureIndex={lectureIndex}
              errors={errors}
            />
          </CardContent>
        </Card>
      ))}
      <Button
        type='button'
        onClick={() =>
          appendLecture({
            title: "",
            videoUrl: "",
            pdfNotes: [],
          })
        }
        className={cn(
          "bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white hover:from-[#2D7F74] hover:to-[#3DB6A6] rounded-full"
        )}>
        <Plus className='h-4 w-4 mr-2' /> Add Lecture
      </Button>
    </div>
  );
};

// Component to handle PDF notes fields
const PdfNotesFields = ({
  control,
  moduleIndex,
  lectureIndex,
  errors,
}: {
  control: any;
  moduleIndex: number;
  lectureIndex: number;
  errors: any;
}) => {
  const {
    fields: pdfNotesFields,
    append: appendPdfNote,
    remove: removePdfNote,
  } = useFieldArray({
    control,
    name: `modules.${moduleIndex}.lectures.${lectureIndex}.pdfNotes`,
  });

  return (
    <div className='space-y-4 mt-4'>
      <Label className='text-gray-600'>PDF Notes</Label>
      {pdfNotesFields.map((pdfNote, pdfNoteIndex) => (
        <div key={pdfNote.id} className='flex gap-4 items-center'>
          <div className='flex-1'>
            <Controller
              name={`modules.${moduleIndex}.lectures.${lectureIndex}.pdfNotes.${pdfNoteIndex}.public_id`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='PDF Public ID'
                  className='border-[#3DB6A6] focus:ring-[#3DB6A6]'
                />
              )}
            />
            {errors.modules?.[moduleIndex]?.lectures?.[lectureIndex]
              ?.pdfNotes?.[pdfNoteIndex]?.public_id && (
              <p className='text-red-500 text-sm'>
                {
                  errors.modules[moduleIndex].lectures[lectureIndex].pdfNotes[
                    pdfNoteIndex
                  ].public_id.message
                }
              </p>
            )}
          </div>
          <div className='flex-1'>
            <Controller
              name={`modules.${moduleIndex}.lectures.${lectureIndex}.pdfNotes.${pdfNoteIndex}.url`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='PDF URL'
                  className='border-[#3DB6A6] focus:ring-[#3DB6A6]'
                />
              )}
            />
            {errors.modules?.[moduleIndex]?.lectures?.[lectureIndex]
              ?.pdfNotes?.[pdfNoteIndex]?.url && (
              <p className='text-red-500 text-sm'>
                {
                  errors.modules[moduleIndex].lectures[lectureIndex].pdfNotes[
                    pdfNoteIndex
                  ].url.message
                }
              </p>
            )}
          </div>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => removePdfNote(pdfNoteIndex)}
            className='bg-red-500 hover:bg-red-600'>
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      ))}
      <Button
        type='button'
        onClick={() => appendPdfNote({ public_id: "", url: "" })}
        className={cn(
          "bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white hover:from-[#2D7F74] hover:to-[#3DB6A6] rounded-full"
        )}>
        <Plus className='h-4 w-4 mr-2' /> Add PDF Note
      </Button>
    </div>
  );
};

export default AddCourse;

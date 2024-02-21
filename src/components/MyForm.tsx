import {
  useForm,
  getFormProps,
  getInputProps,
  getTextareaProps,
  type SubmissionResult,
} from "@conform-to/react";
import { parseWithZod, getZodConstraint } from "@conform-to/zod";
import { schema } from "../utils/shared";
import { useState } from "react";

export default function ContactUs({
  lastResult: initialLastResult,
}: {
  lastResult?: SubmissionResult;
}) {
  const [lastResult, setLastResult] = useState(initialLastResult);
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    async onSubmit(event, _context) {
      event.preventDefault();
      // todo: AbortController
      const response = await fetch("/messages", {
        method: "post",
        body: new FormData(event.currentTarget),
      });
      if (!response.ok) {
        const json = await response.json();
        setLastResult(json);
        return;
      }
      setSuccess(true);
    },
  });
  const [success, setSuccess] = useState(false);

  return success ? (
    <p>Thank you for messaging us!</p>
  ) : (
    <form method="post" {...getFormProps(form)}>
      <div>
        <label htmlFor={fields.email.id}>Email</label>
        <input {...getInputProps(fields.email, { type: "email" })} />
        <div id={fields.email.errorId}>{fields.email.errors}</div>
      </div>
      <div>
        <label htmlFor={fields.message.id}>Message</label>
        <textarea {...getTextareaProps(fields.message)} />
        <div id={fields.message.errorId}>{fields.message.errors}</div>
      </div>
      <button>Send</button>
    </form>
  );
}

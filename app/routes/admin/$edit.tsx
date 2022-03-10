import { ActionFunction, useActionData, useTransition, redirect, useLoaderData, Form, Link } from "remix";
import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import TurndownService from 'turndown';

import { getPosts, createPost, getPost } from "~/$postId";
import type { Post } from "~/$postId";
import type { PostError } from '~/routes/admin/new';

export const action: ActionFunction = async ({ request }) => {
  await new Promise(res => setTimeout(res, 1000));
  // This takes the new/updated info in the form and updates the file

  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");


  const errors: PostError = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");

  await createPost({ title, slug, markdown });

  return redirect("/admin");
};

// Why am I not getting any params, I passed them in
export const loader: LoaderFunction = async ({ params }) => {
  if (params.slug === undefined) {
    console.log("I'm missing those params", params);
    return getPost("fun-is-had");
  } else {
    invariant(params.slug, "expected params.slug");
    return getPost(params.slug);

  }
}

export default function EditPost() {
  const turndownService = new TurndownService();
  // get the post.slug for loading the correct post
  const handleClick = (slug: string) => {
    const turndownService = new TurndownService()
    // I think I need to call getPost(slug) in the data loader
    const formBody = turndownService.turndown(post.html);
    console.log("Here's the MD for the form body", formBody);

  }
  const post = useLoaderData();
  const errors = useActionData();
  const transition = useTransition();

  const formBody = turndownService.turndown(post.html);

  return (
    <div className="admin-edit">
      <button onClick={() => handleClick('fun-is-had')}>Button</button>
      <main>
        <Form method="post">
          <p>
            <label>
              Post Title:{" "}
              {errors?.title ? (
                <em>Title is required</em>
              ) : null}
              <input type="text" name="title" defaultValue={post.title} />
            </label>
          </p>
          <p>
            <label>
              Post Slug:{" "}
              {errors?.slug ? <em>Slug is required</em> : null}
              <input type="text" name="slug" defaultValue={post.slug} />
            </label>
          </p>
          <p>
            <label htmlFor="markdown">Markdown:</label>{" "}
            {errors?.markdown ? (
              <em>Markdown is required</em>
            ) : null}
            <br />
            <textarea id="markdown" rows={20} name="markdown" defaultValue={formBody} />
          </p>
          <p>
            <button type="submit">{transition.submission
              ? "Updating..."
              : "Update Post"}</button>
          </p>
        </Form>
      </main>
    </div>
  );
} 

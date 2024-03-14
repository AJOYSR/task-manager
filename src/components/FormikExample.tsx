import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// const SignupSchema = Yup.object().shape({
//   firstName: Yup.string()
//     .min(2, "Too Short!")
//     .max(50, "Too Long!")
//     .required("Required"),
//   lastName: Yup.string()
//     .min(2, "Too Short!")
//     .max(50, "Too Long!")
//     .required("Required"),
//   email: Yup.string().email("Invalid email").required("Required"),
// });

export const FormikExample = () => (
  <div>
    <h1>Signup</h1>
    <Formik
      initialValues={{
        name: "",
      }}
      onSubmit={(values) => {
        // same shape as initial values
        console.log(values);
      }}
    >
      <Form>
        <Field name="name" />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  </div>
);

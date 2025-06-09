type ValuesProps = {
  title: string;
  description: string;
  payer_name: string;
  state: string;
  file: File;
};

export const postContract = async (values: ValuesProps) => {
  const formData = new FormData();

  // Append each property to formData
  Object.keys(values).forEach((key) => {
    if (key === 'file') {
      formData.append(key, values.file);
    } else if (key === 'state') {
      formData.append(key, values.state);
    } else if (key === 'title') {
      formData.append(key, values.title);
    } else if (key === 'description') {
      formData.append(key, values.description);
    } else if (key === 'payer_name') {
      formData.append(key, values.payer_name);
    }
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  return data;
};

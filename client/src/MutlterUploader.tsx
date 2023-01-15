import { FC, useState } from "react";

const MutlterUploader: FC = () => {
  // let [image,setImage]=useState<File | null>(null);
  let [images, setImages] = useState<File[]>([]);
  let [previews, setPreviews] = useState<string[]>([]);

  let setDataURL = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        return resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    if (images.length > 0) {
      let formData = new FormData();
      // formData.append("image", image);
      images.forEach((image) => {
        formData.append("images", image);
      });
      try {
        //   let response = await fetch("http://localhost:3001/upload", {
        //     method: "POST",
        //     body: formData,
        //   });
        let response = await fetch("http://localhost:3001/multipleUpload", {
          method: "POST",
          body: formData,
        });
        console.log(response);
        let data = await response.json();
        console.log(data);
      } catch (error) {
        alert(error);
      }
    }
  };

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    if (event.target.files) {
      // let file = event.target.files[0];
      // console.log(event.target.files);
      // let reader = new FileReader();
      // reader.readAsDataURL(file);
      // reader.onloadend = (event) => {
      //   console.log(reader.result);
      // };
      const FileArrayList: File[] = [...event.target.files];
      setImages((images) => [...images, ...FileArrayList]);

      const newPreviews: string[] | any[] = await Promise.all(
        FileArrayList.map((file) => {
          return setDataURL(file);
        })
      );
      setPreviews((previews) => [...previews, ...newPreviews]);
      console.log("hello previews");
    } else {
      alert("file not selected please select the file");
    }
  };
  console.log(images);
  console.log(previews);
  return (
    <div className="flex justify-center items-center mt-10 gap-x-4 flex-wrap">
      {previews.length > 0 &&
        previews.map((preview) => {
          return <img src={preview} className="" />;
        })}
      <form
        onSubmit={submitHandler}
        className="flex justify-center items-center bg-orange-700"
      >
        <input
          type="file"
          accept="image/*"
          onChange={onChangeHandler}
          multiple
          className="pl-2"
        />
        <button type="submit" className="p-4 bg-black text-white">
          Upload...
        </button>
      </form>
    </div>
  );
};

export default MutlterUploader;

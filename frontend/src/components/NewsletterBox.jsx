const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        Abonnez-vous à notre Newsletter et recevez nos dernières nouveautés
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          className="w-full sm:flex-1 outline-none"
          type="email"
          placeholder="Entrez votre email"
          required
        />

        <button
          type="submit"
          className="bg-black text-white text-xs px-10 py-4"
        >
          S&apos;ABONNER
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;

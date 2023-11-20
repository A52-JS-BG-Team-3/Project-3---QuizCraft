// We need access to the shared app state
const { setContext } = useContext(AppContext);

// the actual registration code
const onRegister = () => {
// TODO: validate the form before submitting request

// check if an user with the handle exists
getUserByHandle(form.handle)
  .then(snapshot => {
    if (snapshot.exists()) {
      throw new Error(`Handle @${form.handle} has already been taken!`);
    }

    return registerUser(form.email, form.password);
  })
  .then(credential => {

    // the handle is unique, so create a user record in the database with the handle, user id, data of creation, email and a map to liked Posts (an empty object initially)
    return createUserHandle(form.handle, credential.user.uid, credential.user.email)
      .then(() => {
        setContext({
          user: credential.user,
        });
      });
  })
  .then(() => {
    navigate('/');
  })
  .catch(e => console.log(e));
};
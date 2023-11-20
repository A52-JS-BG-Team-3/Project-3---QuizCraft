  // We need access to the shared app state
  const { setContext } = useContext(AppContext);

  const onLogin = () => {
    // TODO: validate form before submitting

    loginUser(form.email, form.password)
      .then(credential => {
        setContext({
          user: credential.user,
        });
      })
      .then(() => {
        navigate('/');
      })
      .catch(e => console.log(e.message));
  };

    // logout the user
    const onLogout = () => {
        logoutUser()
          .then(() => {
            setAppState({
              user: null,
              userData: null,
            });
          });
      };
    
      ...
        <Link to='/'>Home</Link> &nbsp;
          {user === null && <Link to='/register'>Register</Link>} &nbsp;
          {user === null && <Link to='/login'>Login</Link>} &nbsp;
          {user !== null && <Link to='/' onClick={onLogout}>Logout</Link>}
        </div>
      ...
    
      // TODO: apply the same logic to routes
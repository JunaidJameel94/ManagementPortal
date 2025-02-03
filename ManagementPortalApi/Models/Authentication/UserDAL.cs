using System.Data.SqlClient;
using System.Data;

namespace ManagementPortalApi.Models.Authentication
{
    public class UserDAL
    {
        public UserDTO ValidateUser(string pLogin, string pPassword, IConfiguration config)
        {
            UserDTO userDTO = new UserDTO();

            using (SqlConnection connection = new SqlConnection(Environment.GetEnvironmentVariable("AM_DATABASE")))//DataEncryptor.DecryptPassword(Environment.GetEnvironmentVariable("AM_AUTHENTICATION")))
            {
                using (SqlCommand sqlCommand = new SqlCommand("sp_select_user", connection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.AddWithValue("@LoginName", pLogin);
                    sqlCommand.Parameters.AddWithValue("@UserPassword", pPassword == "NULL" ? "NULL" : pPassword);
                    if (connection.State == ConnectionState.Closed)
                    {
                        connection.Open();
                    }
                    using (SqlDataReader dataReader = sqlCommand.ExecuteReader())
                    {
                        using (DataTable dataTable = new DataTable())
                        {
                            dataTable.Load(dataReader);

                            bool containsusername = dataTable.AsEnumerable().Any(row => pLogin.ToLower() == row.Field<string>("LoginName").ToLower());

                            if (dataTable.Rows.Count == 1 && containsusername == true)
                            {

                                bool active = (bool)dataTable.Rows[0]["IsActive"];

                                if (active)
                                {
                                    userDTO.UserID = (int)dataTable.Rows[0]["UserID"];
                                    userDTO.UserName = dataTable.Rows[0]["UserName"].ToString();
                                    userDTO.UserEmail = dataTable.Rows[0]["UserEmail"].ToString();
                                    return userDTO;
                                }
                                else
                                {
                                    return null;
                                }
                            }
                            else
                            {
                                return null;
                            }
                        }
                    }
                }
            }
        }

        public ApiUserDTO ValidateApiUser(string pUsername, string pPassword, IConfiguration config)
        {
            ApiUserDTO apiUser = new ApiUserDTO();

            using (SqlConnection connection = new SqlConnection(Environment.GetEnvironmentVariable("AM_DATABASE")))//DataEncryptor.DecryptPassword(Environment.GetEnvironmentVariable("AM_AUTHENTICATION")))
            {
                using (SqlCommand sqlCommand = new SqlCommand("sp_selectapiuser_dal", connection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.AddWithValue("@UserName", pUsername);
                    sqlCommand.Parameters.AddWithValue("@UserPassword", pPassword == "NULL" ? "NULL" : pPassword);
                    if (connection.State == ConnectionState.Closed)
                    {
                        connection.Open();
                    }
                    using (SqlDataReader dataReader = sqlCommand.ExecuteReader())
                    {
                        using (DataTable dataTable = new DataTable())
                        {
                            dataTable.Load(dataReader);

                            bool containsusername = dataTable.AsEnumerable().Any(row => pUsername.ToLower() == row.Field<string>("UserName").ToLower());

                            if (dataTable.Rows.Count == 1 && containsusername == true)
                            {

                                bool active = (bool)dataTable.Rows[0]["IsActive"];

                                if (active)
                                {
                                    apiUser.UserID = dataTable.Rows[0]["userid"].ToString();
                                    apiUser.UserName = dataTable.Rows[0]["username"].ToString();
                                    apiUser.UserEmail = dataTable.Rows[0]["useremail"].ToString();
                                    apiUser.AccessLevel = dataTable.Rows[0]["accesslevel"].ToString(); //modulename
                                    apiUser.ApiDelay = dataTable.Rows[0]["apidelay"].ToString();
                                    return apiUser;
                                }
                                else
                                {
                                    return null;
                                }
                            }
                            else
                            {
                                return null;
                            }
                        }
                    }
                }
            }
        }

    }
}
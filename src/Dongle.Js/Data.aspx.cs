using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Dongle.Test
{
    public partial class _Default : System.Web.UI.Page
    {
        //public ActionResult Index(string @orderby, string sort, NameValueCollection querystring, int skip = 0)
        protected void Page_Load(object sender, EventArgs e)
        {
            int skip;
            Int32.TryParse(Request.QueryString["skip"], out skip);
            var sort = Request.QueryString["sort"];
            var param = HttpUtility.UrlDecode(Request.RawUrl);
            var paramArray = param.Split('|');
            if (paramArray.Length > 1)
            {
                paramArray[2] = paramArray[2].Split('&')[0];
            }
            string content = string.Empty;
            int startRow = skip + 1;
            const int listItemCount = 10;
            int topRows;
            const int totalCount = 20;

            if ((startRow + listItemCount) >= totalCount)
            {
                topRows = totalCount;
            }
            else
            {
                topRows = startRow + listItemCount - 1;
            }

            if (paramArray.Length > 1 && !string.IsNullOrEmpty(paramArray[2]))
            {
                topRows = totalCount;
            }

            content += @"{""Data"": [";
            if (sort == "desc")
            {
                for (int i = (totalCount - startRow + 1); i > (totalCount - topRows); i--)
                {
                    if (paramArray.Length > 1 && !string.IsNullOrEmpty(paramArray[2]))
                    {
                        if (GetValue(i, paramArray)) continue;
                    }
                    if (content.Substring(content.Length - 2, 2) == "\"}")
                    {
                        content += ",";
                    }
                    content += "{";
                    content += @"""rownum"": """ + i + @""",";
                    content += @"""field1"": """ + i + @""",";
                    for (int x = 2; x < 21; x++)
                    {
                        content += @"""field" + x + @""": ""Lorem ipsum dolor sit amet""";
                        if (x != 20)
                        {
                            content += ",";
                        }
                    }
                    content += "}";
                }
            }
            else
            {
                for (int i = startRow; i < (topRows + 1); i++)
                {
                    if (paramArray.Length > 1 && !string.IsNullOrEmpty(paramArray[2]))
                    {
                        if (GetValue(i, paramArray)) continue;
                    }
                    if (content.Substring(content.Length - 2, 2) == "\"}")
                    {
                        content += ",";
                    }
                    content += "{";
                    content += @"""rownum"": """ + i + @""",";
                    content += @"""field1"": """ + i + @""",";
                    for (int x = 2; x < 21; x++)
                    {
                        content += @"""field" + x + @""": ""Lorem ipsum dolor sit amet""";
                        if (x != 20)
                        {
                            content += ",";
                        }
                    }
                    content += "}";
                }
            }
            content += @"],""TotalCount"":" + totalCount + @"}";
            Response.ContentType = "application/json";
            Response.Write(content);
        }

        private static bool GetValue(int i, string[] paramArray)
        {
            if (paramArray[1] == "equals")
            {
                if (Int32.Parse(paramArray[2]) != i)
                {
                    return true;
                }
            }
            else if (paramArray[1] == "startsWith")
            {
                if (i.ToString().Length > 1)
                {
                    if (paramArray[2] != i.ToString().Substring(0, i.ToString().Length - 1))
                    {
                        return true;
                    }
                }
                else
                {
                    if (paramArray[2] != i.ToString())
                    {
                        return true;
                    }
                }
                
            }
            else if (paramArray[1] == "contains")
            {
                char[] containArray = i.ToString().ToCharArray();
                if (containArray.Length == 1)
                {
                    if (containArray[0].ToString() != paramArray[2])
                    {
                        return true;
                    }
                }
                else
                {
                    if (containArray[0].ToString() != paramArray[2] && containArray[1].ToString() != paramArray[2])
                    {
                        return true;
                    }
                }
            }
            else if (paramArray[1] == "endsWith")
            {
                if (i.ToString().Length > 1)
                {
                    if (paramArray[2] != i.ToString().Substring(i.ToString().Length - 1, 1))
                    {
                        return true;
                    }
                }
                else
                {
                    if (paramArray[2] != i.ToString())
                    {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}
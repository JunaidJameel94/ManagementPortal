namespace ManagementPortalApi.Models.MGNews
{
    public class MGNews
    {
        public int NewsID { get; set; }
        public string CategoryID { get; set; }
        public string CategoryName { get; set; }
        public string AurthorID { get; set; }
        public string AurthorName { get; set; }
        public string Link { get; set; }
        public Headings Headings { get; set; }
        public Descriptions Descriptions { get; set; }
        public Contents Contents { get; set; }
        public Images Images { get; set; }
        public Tags Tags { get; set; }
        public Slugs Slugs { get; set; }
        public DateTime PublishedTime { get; set; }        
    }
    public class Headings
    {
        public List<string> Heading { get; set; }
    }
    public class Descriptions
    {
        public List<string> Description { get; set; }
    }
    public class Contents
    {
        public List<string> Content { get; set; }
    }
    public class Images 
    {
        public List<string> Image { get; set; }
    }
    public class Tags 
    { 
        public List<Tag> Tag { get; set; }
    }
    public class Tag 
    { 
        public string TagName { get; set; }
        public string TagType { get; set; }
    }
    public class Slugs
    {
        public List<Slug> Slug { get; set; }
    }
    public class Slug
    {
        public string SlugName { get; set; }
        public string SlugType { get; set; }
    }

}

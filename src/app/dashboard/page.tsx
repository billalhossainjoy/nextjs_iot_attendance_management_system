import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart3, Users, ChevronUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Students
                  </p>
                  <h3 className="text-2xl font-bold mt-1">235</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ChevronUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">12%</span>
                <span className="text-muted-foreground ml-1">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Students
                  </p>
                  <h3 className="text-2xl font-bold mt-1">198</h3>
                </div>
                <div className="p-2 bg-green-500/10 rounded-full">
                  <Users className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-muted-foreground">84% active rate</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Performance
                  </p>
                  <h3 className="text-2xl font-bold mt-1">89%</h3>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ChevronUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">3%</span>
                <span className="text-muted-foreground ml-1">
                  from last week
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Weekly performance trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">
                  Performance chart visualization
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest student activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`/avatar-${i + 1}.png`} />
                      <AvatarFallback>{`S${i + 1}`}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Student {i + 1}</p>
                      <p className="text-xs text-muted-foreground">
                        {i % 2 === 0
                          ? "Completed assignment"
                          : "Submitted project"}{" "}
                        •{i % 2 === 0 ? " 30 mins ago" : " 45 mins ago"}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        i % 2 === 0
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {i % 2 === 0 ? "Completed" : "Submitted"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Class Performance</CardTitle>
              <Tabs defaultValue="all" className="w-[300px]">
                <TabsList>
                  <TabsTrigger value="all">All Classes</TabsTrigger>
                  <TabsTrigger value="current">Current</TabsTrigger>
                  <TabsTrigger value="previous">Previous</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 pb-4 border-b text-sm font-medium">
              <div>Class</div>
              <div>Students</div>
              <div>Performance Rate</div>
            </div>
            {[
              { name: "Class 10A", students: 32, rate: 92 },
              { name: "Class 9B", students: 28, rate: 86 },
              { name: "Class 11C", students: 30, rate: 88 },
              { name: "Class 12A", students: 35, rate: 94 },
              { name: "Class 8D", students: 29, rate: 82 },
            ].map((cls, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 py-4 border-b">
                <div className="font-medium">{cls.name}</div>
                <div>{cls.students} students</div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${cls.rate}%` }}
                      />
                    </div>
                    <span className="text-sm">{cls.rate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

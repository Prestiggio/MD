<?php

namespace Ry\Md\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class Colon extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rymd:colonize {destination}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create child theme from md';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $fs = new Filesystem();
        $fs->copyDirectory($directory, $destination);
    }
}
